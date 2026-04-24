import requests
import json
def classifier_email(sujet, corps_nettoye):
    url = "http://localhost:11434/api/generate"
    
    # On simplifie les clés demandées (sans accents) pour faciliter le parsing
    prompt = f"""### Instruction:
Tu es un assistant intelligent pour une université. Analyse l'email et retourne STRICTEMENT un JSON avec ces clés :
"categorie", "sous_categorie", "resume", "urgence".

Utilise ces labels :
- categorie : Demande_Pedagogique, Demande_Administrative, Partenariat, Support_Technique
- sous_categorie : Suivi_Examens, Organisation_Enseignements, Encadrement_FinDeCycle, Offres_Formation, Gestion_Personnel, Logistique_Administrative, Directives_Hierarchie, Scolarité_Etudiant
- urgence : Haute, Moyenne, Basse

### Input:
Sujet: {sujet}
Corps: {corps_nettoye}

### Response:"""

    payload = {
        "model": "pfe-assistant",
        "prompt": prompt,
        "stream": False,
        "format": "json" 
    }

    try:
        response = requests.post(url, json=payload, timeout=120)
        data = response.json()
        
        # Nettoyage de la réponse
        prediction = json.loads(data["response"]) 
        print(f"🔎 RAW LLM output: {prediction}")
        # ── SÉCURITÉ : Normalisation des clés ──
        # Si Qwen a quand même mis des accents, on les remet au propre
        final_res = {
            "categorie": prediction.get('categorie') or prediction.get('catégorie') or "Inconnue",
            "sous_categorie": prediction.get('sous_categorie') or prediction.get('sous_catégorie') or "Inconnue",
            "resume": prediction.get('resume') or prediction.get('résumé') or "Sans résumé",
            "urgence": prediction.get('urgence') or prediction.get('niveau d\'urgence') or "Moyenne"
        }
        
        return final_res

    except Exception as e:
        print(f"❌ Erreur parsing JSON : {e}")
        return {
            "categorie": "Erreur",
            "sous_categorie": "Erreur",
            "resume": "Erreur technique",
            "urgence": "Moyenne"
        }