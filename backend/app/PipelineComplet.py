import sys
import os
from datetime import datetime
# ── Chemins ────────────────────────────────────────────────────────
SRC_PATH = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SRC_PATH)

# On s'assure que le dossier database existe
DB_DIR = os.path.join(SRC_PATH, '..', 'database')
if not os.path.exists(DB_DIR):
    os.makedirs(DB_DIR)

DB_PATH = os.path.join(DB_DIR, 'emails_pfe.db')

# ── Imports modules ────────────────────────────────────────────────
import db
import cleaner
import profil
import priorite
import classifier
import collector
import recurrence
import attachments_handler
# ── Configuration ──────────────────────────────────────────────────
db.DB_PATH = DB_PATH
profil.DB_PATH = DB_PATH
db.initialiser_bdd()

def traiter_email_complet(msg, corps):
    
    try:
        corps_nettoye = cleaner.nettoyer_texte(corps)
        corps_nettoye = cleaner.extraire_contenu_pertinent(msg.subject or "", corps_nettoye)
        
        profil_info     = profil.detecter_profil_expediteur(msg.sender)
        conformite_info = profil.verifier_conformite(msg.sender)
        profil_info['conformite'] = conformite_info['conformite']

        resultat_llm = classifier.classifier_email(msg.subject or "", corps_nettoye)
        if not isinstance(resultat_llm, dict):
            resultat_llm = {
                'categorie': 'Erreur',
                'sous_categorie': 'Inconnue',
                'resume': 'Erreur de génération',
                'urgence': 'Moyenne'
            }

        priorite_info = priorite.calculer_priorite(
            urgence_llm    = resultat_llm.get('urgence'),
            categorie      = resultat_llm.get('categorie'),
            sous_categorie = resultat_llm.get('sous_categorie'),
            profil         = profil_info.get('profil', 'Externe')
        )
        date_actuelle    = datetime.now().isoformat()
        recurrence_info  = recurrence.analyser_recurrence(
        id_email = msg.id,
        resume   = resultat_llm.get('tag', ''),
        date     = date_actuelle
      )
        pieces_jointes = attachments_handler.sauvegarder_pieces_jointes(msg)
        db.sauvegarder_final(
             msg.id,
             msg.thread_id,
             msg.sender,
             msg.subject,
             corps_nettoye,
             profil_info,
             resultat_llm,
             priorite_info,
             attachments=pieces_jointes if pieces_jointes else None,
             est_recurrent = int(recurrence_info['est_recurrent']),
             nb_similaires = recurrence_info['nb_similaires']
            )

        print(f"\n" + "="*50)
        print(f"📩 OBJET           : {msg.subject}")
        print(f"👤 EXPÉDITEUR      : {msg.sender}")
        print(f"🏢 PROFIL          : {profil_info.get('profil')}")
        print(f"🔒 CONFORMITÉ      : {profil_info.get('conformite')}")
        print(f"📂 CATÉGORIE       : {resultat_llm.get('categorie')}")
        print(f"🔍 SOUS-CAT        : {resultat_llm.get('sous_categorie')}")
        print(f"📝 RÉSUMÉ          : {resultat_llm.get('resume')}")
        print(f"⚡ URGENCE LLM     : {resultat_llm.get('urgence')}")
        print(f"🏆 PRIORITÉ FINALE : {priorite_info.get('priorite')} (Score: {priorite_info.get('score')})")
        print(f"🔁 RÉCURRENT       : {'Oui' if recurrence_info['est_recurrent'] else 'Non'} ({recurrence_info['nb_similaires']} similaire(s))")
        return True

    except Exception as e:
        print(f"⚠️ Erreur critique : {e}")
        import traceback
        traceback.print_exc()
        return False
if __name__ == "__main__":
    print("🔥 Démarrage du système de gestion IA...")
    # On lance le collector qui va boucler et appeler traiter_email_complet
    collector.lancer_pipeline_react(db, traiter_email_complet)