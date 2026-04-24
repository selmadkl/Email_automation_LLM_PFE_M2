import sqlite3
from datetime import datetime

DB_PATH = "./database/emails_pfe.db"

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
            date_classification TEXT DEFAULT (datetime('now'))
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
def sauvegarder_final(msg_id, thread_id, sender, subject, profil_info, res_llm, priorite_info):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR IGNORE INTO emails_processed 
        (message_id, thread_id, expediteur, sujet, profil, conformite, categorie, sous_categorie, resume, urgence_llm, priorite_finale, score_priorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        msg_id, thread_id, sender, subject,
        profil_info['profil'], profil_info['conformite'],
        res_llm['categorie'], res_llm['sous_categorie'],
        res_llm['resume'], res_llm['urgence'],
        priorite_info['priorite'], priorite_info['score']
    ))
    conn.commit()
    conn.close()