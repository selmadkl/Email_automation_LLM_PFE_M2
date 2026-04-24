import sqlite3
import re

DB_PATH = "./database/emails_pfe.db"
DOMAINE_INSTITUTIONNEL = "fgei.ummto.dz"

def extraire_email_pur(raw_sender):
    match = re.search(r'<(.*)>', raw_sender)
    if match:
        return match.group(1).lower().strip()
    return raw_sender.lower().strip()

def detecter_profil_expediteur(email_raw: str) -> dict:
    email_expediteur = extraire_email_pur(email_raw)
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT profil, nom FROM expediteurs WHERE adresse_email = ?",
            (email_expediteur,)
        )
        result = cursor.fetchone()
        conn.close()
        if result:
            return {"profil": result[0], "nom": result[1] if result[1] else "Inconnu"}
        domaine = email_expediteur.split("@")[-1]
        if domaine == DOMAINE_INSTITUTIONNEL:
            return {"profil": "Institutionnel", "nom": "Membre FGEI"}
        return {"profil": "Externe", "nom": "Inconnu"}
    except Exception as e:
        print(f"⚠️ Erreur profil : {e}")
        return {"profil": "Externe", "nom": "Inconnu"}

def verifier_conformite(email_raw: str) -> dict:
    email_expediteur = extraire_email_pur(email_raw)
    domaine = email_expediteur.split("@")[-1]
    if domaine != DOMAINE_INSTITUTIONNEL:
        return {"conforme": False, "conformite": "Identité non certifiée"}
    return {"conforme": True, "conformite": "Certifié "}