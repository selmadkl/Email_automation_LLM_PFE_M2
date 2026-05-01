# backend/app/fix_corps.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from simplegmail import Gmail
import sqlite3
import cleaner

DB_PATH = r"C:\Users\dehbi\OneDrive\Bureau\PFE M2\backend\database\emails_pfe.db"

def fix_corps():
    gmail = Gmail()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    # Récupère tous les emails sans corps
    rows = conn.execute(
        "SELECT message_id FROM emails_processed WHERE corps IS NULL OR corps = ''"
    ).fetchall()

    print(f"📧 {len(rows)} emails sans corps à mettre à jour...")

    messages = gmail.get_messages()
    msgs_dict = {msg.id: msg for msg in messages}

    updated = 0
    for row in rows:
        msg_id = row['message_id']
        if msg_id in msgs_dict:
            msg = msgs_dict[msg_id]
            corps_brut = msg.plain or ""
            corps_nettoye = cleaner.nettoyer_texte(corps_brut)
            corps_nettoye = cleaner.extraire_contenu_pertinent(msg.subject or "", corps_nettoye)

            conn.execute(
                "UPDATE emails_processed SET corps = ? WHERE message_id = ?",
                (corps_nettoye, msg_id)
            )
            updated += 1
            print(f"✅ Mis à jour : {msg.subject or 'Sans objet'}")
        else:
            print(f"⚠️ Introuvable dans Gmail : {msg_id}")

    conn.commit()
    conn.close()
    print(f"\n✅ {updated} emails mis à jour sur {len(rows)}")

if __name__ == "__main__":
    fix_corps()