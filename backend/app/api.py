# backend/app/api.py
from flask import Blueprint, jsonify, request
import sqlite3
import  db

api_bp = Blueprint('api', __name__)


@api_bp.route('/emails', methods=['GET'])
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

    query += " ORDER BY score_priorite DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@api_bp.route('/emails/<string:message_id>', methods=['GET'])
def get_email(message_id):
    conn = sqlite3.connect(db.DB_PATH)
    conn.row_factory = sqlite3.Row
    row = conn.execute(
        "SELECT * FROM emails_processed WHERE message_id = ?",
        (message_id,)
    ).fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'Email non trouvé'}), 404
    return jsonify(dict(row))


@api_bp.route('/stats', methods=['GET'])
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
    total = conn.execute(
        "SELECT COUNT(*) as n FROM emails_processed"
    ).fetchone()['n']
    conn.close()

    return jsonify({
        'total':         total,
        'par_categorie': [dict(r) for r in par_categorie],
        'par_priorite':  [dict(r) for r in par_priorite],
        'par_profil':    [dict(r) for r in par_profil],
    })


@api_bp.route('/recurrents', methods=['GET'])
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


@api_bp.route('/expediteurs', methods=['GET'])
def get_expediteurs():
    conn = sqlite3.connect(db.DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM expediteurs").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])