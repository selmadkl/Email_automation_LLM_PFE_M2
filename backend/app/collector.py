import os
import time
from dotenv import load_dotenv
from simplegmail import Gmail

# 1. On localise le dossier où se trouve le script actuel (backend/app/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. On charge le .env qui se trouve un dossier au-dessus (dans backend/)
dotenv_path = os.path.join(BASE_DIR, '..', '.env')
load_dotenv(dotenv_path)

def lancer_pipeline_react(db, traiter_email_complet):
    try:
        # 3. On construit les chemins complets vers les fichiers de config
        # os.getenv("TOKEN_PATH") récupère "config/gmail_token.json"
        # On remonte d'un cran (..) pour sortir de 'app' et entrer dans 'config'
        path_secret = os.path.join(BASE_DIR, '..', os.getenv("CLIENT_SECRET_PATH"))
        path_token = os.path.join(BASE_DIR, '..', os.getenv("TOKEN_PATH"))

        print(f"📂 Chemin secret : {path_secret}")
        
        # 4. Initialisation avec les bons arguments
        gmail = Gmail(client_secret_file=path_secret, creds_file=path_token)
        
        print("✅ Connexion Gmail API : OK")
        
    except Exception as e:
        print(f"❌ Erreur d'initialisation Gmail : {e}")

    while True:
        try:
            # 1. Récupérer uniquement les mails non lus
            messages = gmail.get_unread_inbox()
            
            if not messages:
                print("😴 Aucun nouveau mail. Attente...")
            else:
                for msg in messages:
                    # 2. Vérification par ID (TEXTE) dans SQLite
                    # On vérifie si cet ID unique Google n'est pas déjà en base
                    if not db.mail_deja_traite(msg.id):
                        
                        print(f"📩 Traitement du mail : {msg.subject} (ID: {msg.id})")
                        
                        try:
                            corps = msg.plain if msg.plain else ""
                            
                            # On lance le traitement. 
                            # C'est 'traiter_email_complet' qui va s'occuper de db.sauvegarder_final
                            success = traiter_email_complet(msg, corps)
                            
                            if success:
                                msg.mark_as_read()
                                print(f"✅ Mail {msg.id} traité et marqué comme lu.")
                            
                        except Exception as e:
                            print(f"⚠️ Erreur sur le mail {msg.id} : {e}")
                    
            # 7. Pause intelligente (20 secondes pour ne pas saturer ton PC avec Ollama)
            time.sleep(20)

        except Exception as e:
            print(f"⚠️ Erreur de connexion : {e}")
            print("🔄 Reconnexion dans 10 secondes...")
            time.sleep(10)