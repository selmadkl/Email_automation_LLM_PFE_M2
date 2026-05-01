import sqlite3
from datetime import datetime
import json
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, '..', os.getenv("DB_PATH"))



def initialiser_bdd():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS emails_processed (
            message_id          TEXT PRIMARY KEY,
            thread_id           TEXT,
            expediteur          TEXT,
            sujet               TEXT,
            profil              TEXT,
            conformite          TEXT,
            categorie           TEXT,
            sous_categorie      TEXT,
            resume              TEXT,
            urgence_llm         TEXT,
            priorite_finale     TEXT,
            score_priorite      REAL,
            attachments         TEXT,
            est_recurrent       INTEGER DEFAULT 0,
            nb_similaires       INTEGER DEFAULT 0,
            date_classification TEXT DEFAULT (datetime('now'))
        )
    ''')
    
    # Table des expéditeurs
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS expediteurs (
        adresse_email TEXT PRIMARY KEY,
        nom           TEXT,
        profil        TEXT DEFAULT 'Externe'
    )
''')
    conn.commit()
    conn.close()

def mail_deja_traite(message_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM emails_processed WHERE message_id = ?", (message_id,))
    existe = cursor.fetchone() is not None
    conn.close()
    return existe


def sauvegarder_final(msg_id, thread_id, sender, subject, corps,
                      profil_info, res_llm, priorite_info,
                      attachments=None, est_recurrent=0, nb_similaires=0):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR IGNORE INTO emails_processed 
        (message_id, thread_id, expediteur, sujet, corps, profil, conformite,
         categorie, sous_categorie, resume, urgence_llm, priorite_finale,
         score_priorite, attachments, est_recurrent, nb_similaires)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        msg_id, thread_id, sender, subject, corps,
        profil_info['profil'], profil_info['conformite'],
        res_llm['categorie'], res_llm['sous_categorie'],
        res_llm['resume'], res_llm['urgence'],
        priorite_info['priorite'], priorite_info['score'],
        json.dumps(attachments) if attachments else None,
        est_recurrent, nb_similaires
    ))
    conn.commit()
    conn.close()