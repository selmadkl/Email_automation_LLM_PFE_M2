import sqlite3
conn = sqlite3.connect(r"C:\Users\dehbi\OneDrive\Bureau\PFE M2\backend\database\emails_pfe.db")

# Vérifie si la table existe
print(conn.execute("SELECT COUNT(*) FROM groupes_recurrents").fetchone())

# Vérifie les emails récurrents
print(conn.execute("SELECT COUNT(*) FROM emails_processed WHERE est_recurrent=1").fetchone())

# Vérifie combien ont un groupe_id
print(conn.execute("SELECT COUNT(*) FROM emails_processed WHERE groupe_id IS NOT NULL").fetchone())