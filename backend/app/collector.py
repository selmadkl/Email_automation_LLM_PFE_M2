import time
from simplegmail import Gmail

def lancer_pipeline_react(db, traiter_email_complet):
    print("🚀 Pipeline 'Luxe' démarré (SimpleGmail + React ready)")
    
    try:
        # Initialisation (utilise ton client_secret.json et crée token.json)
        gmail = Gmail() 
        print("✅ Connexion Gmail API : OK")
    except Exception as e:
        print(f"❌ Erreur d'initialisation Gmail : {e}")
        return

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