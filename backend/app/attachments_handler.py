import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
TOKEN_PATH = os.path.join(BASE_DIR, '..', os.getenv("TOKEN_PATH"))



def get_gmail_service():
    creds = Credentials.from_authorized_user_file(TOKEN_PATH)
    return build("gmail", "v1", credentials=creds)

def sauvegarder_pieces_jointes(msg):
    """
    Ne sauvegarde RIEN sur le disque.
    Retourne juste les métadonnées pour la DB.
    """
    service = get_gmail_service()

    message_complet = service.users().messages().get(
        userId="me",
        id=msg.id,
        format="full"
    ).execute()

    parts = message_complet.get("payload", {}).get("parts", [])
    pieces_jointes = []

    for part in parts:
        filename = part.get("filename")
        attachment_id = part.get("body", {}).get("attachmentId")

        if not filename or not attachment_id:
            continue

        pieces_jointes.append({
            "nom":           filename,
            "type":          part.get("mimeType", "application/octet-stream"),
            "attachment_id": attachment_id  # ← clé pour télécharger plus tard
        })
        print(f"📎 PJ détectée : {filename} (id: {attachment_id[:20]}...)")

    return pieces_jointes