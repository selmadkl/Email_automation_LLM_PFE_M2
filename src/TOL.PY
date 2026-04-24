import sqlite3
DB_PATH = "./database/emails_pfe.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("ALTER TABLE emails_processed ADD COLUMN thread_id TEXT")
conn.commit()
conn.close()
print("✅ Colonne thread_id ajoutée")