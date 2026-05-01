import requests
import json
from prompts import prompt_classification, prompt_tag_semantique
from dotenv import load_dotenv
import os
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))


OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL      = os.getenv("OLLAMA_MODEL", "pfe-assistant")

def appel_llm(prompt):
    payload = {
        "model"  : MODEL,
        "prompt" : prompt,
        "stream" : False,
        "format" : "json"
    }
    response = requests.post(OLLAMA_URL, json=payload, timeout=120)
    return response.json()


def generer_tag(resume):
    payload = {
        "model"  : MODEL,
        "prompt" : prompt_tag_semantique(resume),
        "stream" : False
        # ← pas de format json ici car on veut du texte brut
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        tag = response.json().get("response", "").strip()
        # Nettoyage : garder uniquement la première ligne
        tag = tag.split("\n")[0].strip()
        print(f"🏷️  TAG SÉMANTIQUE : {tag}")
        return tag
    except Exception as e:
        print(f"⚠️ Erreur tag : {e}")
        return "OBJET: INCONNU | ETAT: INCONNU"


def classifier_email(sujet, corps_nettoye):
    try:
        # ── Appel 1 : Classification complète ──
        data       = appel_llm(prompt_classification(sujet, corps_nettoye))
        prediction = json.loads(data["response"])
        print(f"🔎 RAW LLM output: {prediction}")

        final_res = {
            "categorie"     : prediction.get('categorie')      or prediction.get('catégorie')       or "Inconnue",
            "sous_categorie": prediction.get('sous_categorie') or prediction.get('sous_catégorie')  or "Inconnue",
            "resume"        : prediction.get('resume')         or prediction.get('résumé')           or "Sans résumé",
            "urgence"       : prediction.get('urgence')        or prediction.get("niveau d'urgence") or "Moyenne"
        }

        # ── Appel 2 : Tag sémantique pour ChromaDB ──
        final_res["tag"] = generer_tag(final_res["resume"])

        return final_res

    except Exception as e:
        print(f"❌ Erreur parsing JSON : {e}")
        return {
            "categorie"     : "Erreur",
            "sous_categorie": "Erreur",
            "resume"        : "Erreur technique",
            "urgence"       : "Moyenne",
            "tag"           : "OBJET: ERREUR | ETAT: ERREUR"
        }