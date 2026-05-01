import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app'))
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import sqlite3
import base64
import io
import db
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
db.initialiser_bdd()



BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
TOKEN_PATH = os.path.join(BASE_DIR, os.getenv("TOKEN_PATH"))
def get_gmail_service():
    creds = Credentials.from_authorized_user_file(TOKEN_PATH)
    return build("gmail", "v1", credentials=creds)

@app.route('/api/attachments/<message_id>/<attachment_id>/<filename>', methods=['GET'])
def get_attachment(message_id, attachment_id, filename):
    try:
        service  = get_gmail_service()
        att_data = service.users().messages().attachments().get(
            userId="me",
            messageId=message_id,
            id=attachment_id
        ).execute()

        data = base64.urlsafe_b64decode(att_data["data"])
        return send_file(
            io.BytesIO(data),
            download_name=filename,
            as_attachment=False
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attachments/view/<message_id>/<attachment_id>/<filename>', methods=['GET'])
def view_attachment(message_id, attachment_id, filename):
    try:
        service  = get_gmail_service()
        att_data = service.users().messages().attachments().get(
            userId="me", messageId=message_id, id=attachment_id
        ).execute()
        data = base64.urlsafe_b64decode(att_data["data"])
        return send_file(io.BytesIO(data), download_name=filename, as_attachment=False)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attachments/download/<message_id>/<attachment_id>/<filename>', methods=['GET'])
def download_attachment(message_id, attachment_id, filename):
    try:
        service  = get_gmail_service()
        att_data = service.users().messages().attachments().get(
            userId="me", messageId=message_id, id=attachment_id
        ).execute()
        data = base64.urlsafe_b64decode(att_data["data"])
        return send_file(io.BytesIO(data), download_name=filename, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/reply', methods=['POST'])
def send_reply():
    try:
        destinataire = request.form.get('destinataire')
        sujet        = request.form.get('sujet')
        corps        = request.form.get('corps')
        thread_id    = request.form.get('thread_id')
        fichiers     = request.files.getlist('attachments')

        # Construire le message MIME
        msg = MIMEMultipart()
        msg['To']      = destinataire
        msg['Subject'] = f"Re: {sujet}"
        msg.attach(MIMEText(corps, 'plain', 'utf-8'))

        # Ajouter les pièces jointes
        for fichier in fichiers:
            if fichier.filename:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(fichier.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename="{fichier.filename}"')
                msg.attach(part)

        # Encoder en base64 pour Gmail API
        raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()

        service = get_gmail_service()
        body = {'raw': raw}
        if thread_id:
            body['threadId'] = thread_id

        service.users().messages().send(userId='me', body=body).execute()
        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/emails', methods=['GET'])
def get_emails():
    categorie = request.args.get('categorie')
    priorite  = request.args.get('priorite')
    profil    = request.args.get('profil')
    conn = sqlite3.connect(db.DB_PATH)
    conn.row_factory = sqlite3.Row
    query  = "SELECT * FROM emails_processed WHERE 1=1"
    params = []
    if categorie:
        query += " AND categorie = ?"
        params.append(categorie)
    if priorite:
        query += " AND priorite_finale = ?"
        params.append(priorite)
    if profil:
        query += " AND profil = ?"
        params.append(profil)
    query += " ORDER BY date_classification DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/emails/<string:message_id>', methods=['GET'])
def get_email(message_id):
    conn = sqlite3.connect(db.DB_PATH)
    conn.row_factory = sqlite3.Row
    row = conn.execute(
        "SELECT * FROM emails_processed WHERE message_id = ?",
        (message_id,)
    ).fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'Email non trouve'}), 404
    return jsonify(dict(row))

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = sqlite3.connect(db.DB_PATH)
    conn.row_factory = sqlite3.Row
    par_categorie = conn.execute(
        "SELECT categorie, COUNT(*) as total FROM emails_processed GROUP BY categorie"
    ).fetchall()
    par_priorite = conn.execute(
        "SELECT priorite_finale, COUNT(*) as total FROM emails_processed GROUP BY priorite_finale"
    ).fetchall()
    par_profil = conn.execute(
        "SELECT profil, COUNT(*) as total FROM emails_processed GROUP BY profil"
    ).fetchall()
    total = conn.execute("SELECT COUNT(*) as n FROM emails_processed").fetchone()['n']
    conn.close()
    return jsonify({
        'total':         total,
        'par_categorie': [dict(r) for r in par_categorie],
        'par_priorite':  [dict(r) for r in par_priorite],
        'par_profil':    [dict(r) for r in par_profil],
    })

@app.route('/api/recurrents', methods=['GET'])
def get_recurrents():
    conn = sqlite3.connect(db.DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT categorie, sous_categorie,
               COUNT(*) as occurrences,
               MAX(date_classification) as derniere_occurrence
        FROM emails_processed
        WHERE est_recurrent = 1
        GROUP BY categorie, sous_categorie
        ORDER BY occurrences DESC
        """
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/expediteurs', methods=['GET'])
def get_expediteurs():
    conn = sqlite3.connect(db.DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM expediteurs").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])
@app.route('/api/ping', methods=['GET'])
def ping():
    conn = sqlite3.connect(db.DB_PATH)
    total = conn.execute("SELECT COUNT(*) FROM emails_processed").fetchone()[0]
    conn.close()
    return jsonify({"total": total})


@app.route('/api/thread/<thread_id>', methods=['GET'])
def get_thread(thread_id):
    try:
        service = get_gmail_service()
        thread  = service.users().threads().get(
            userId='me',
            id=thread_id,
            format='full'
        ).execute()

        # Récupérer l'adresse Gmail de l'utilisateur
        profile     = service.users().getProfile(userId='me').execute()
        mon_email   = profile.get('emailAddress', '').lower()

        messages = []
        for msg in thread.get('messages', []):
            headers = {h['name']: h['value'] for h in msg['payload'].get('headers', [])}
            corps   = ""

            # Extraire corps — cherche dans parts récursivement
            def extraire_corps(payload):
                if payload.get('mimeType') == 'text/plain':
                    data = payload.get('body', {}).get('data', '')
                    if data:
                        return base64.urlsafe_b64decode(data).decode('utf-8', errors='ignore')
                for part in payload.get('parts', []):
                    result = extraire_corps(part)
                    if result:
                        return result
                return ""

            corps = extraire_corps(msg['payload']).strip()

            # Extraire pièces jointes du message
            pjs = []
            for part in msg['payload'].get('parts', []):
                filename      = part.get('filename')
                attachment_id = part.get('body', {}).get('attachmentId')
                if filename and attachment_id:
                    pjs.append({
                        'nom':           filename,
                        'type':          part.get('mimeType', 'application/octet-stream'),
                        'attachment_id': attachment_id
                    })

            expediteur = headers.get('From', '')
            est_moi    = mon_email in expediteur.lower()

            messages.append({
                'id':         msg['id'],
                'de':         expediteur,
                'a':          headers.get('To', '—'),
                'sujet':      headers.get('Subject', 'Sans objet'),
                'date':       headers.get('Date', '—'),
                'corps':      corps,
                'est_moi':    est_moi,
                'pjs':        pjs,
            })

        return jsonify({'messages': messages, 'mon_email': mon_email})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
