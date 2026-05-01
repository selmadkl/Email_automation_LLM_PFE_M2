# ══════════════════════════════════════════════════════════════════
# PROMPT 1 : Analyse métier complète (déjà dans classifier.py)
# ══════════════════════════════════════════════════════════════════

def prompt_classification(sujet, corps):
    return f"""### Instruction:
Tu es un assistant intelligent pour une université. Analyse l'email et retourne STRICTEMENT un JSON avec ces clés :
"categorie", "sous_categorie", "resume", "urgence".
Utilise ces labels :
- categorie : Demande_Pedagogique, Demande_Administrative, Partenariat, Support_Technique
- sous_categorie : Suivi_Examens, Organisation_Enseignements, Encadrement_FinDeCycle, Offres_Formation, Gestion_Personnel, Logistique_Administrative, Directives_Hierarchie, Scolarité_Etudiant
- urgence : Haute, Moyenne, Basse
### Input:
Sujet: {sujet}
Corps: {corps}
### Response:"""


# ══════════════════════════════════════════════════════════════════
# PROMPT 2 : Génération du Tag Sémantique (nouveau)
# ══════════════════════════════════════════════════════════════════
def prompt_tag_semantique(resume):
    return f"""### Instruction:
Tu es un système de normalisation sémantique.
Génère UN SEUL tag au format strict : "OBJET: X | ETAT: Y"

Exemples :
- "Panne électrique au laboratoire" → OBJET: ELEC | ETAT: PANNE
- "Absence d'un enseignant au cours" → OBJET: COURS | ETAT: ABSENCE  
- "Demande de relevé de notes" → OBJET: NOTES | ETAT: DEMANDE
- "Problème connexion internet salle" → OBJET: RESEAU | ETAT: PANNE
- "Report d'examen de module X" → OBJET: EXAM | ETAT: REPORT

### Input:
Resume: {resume}
### Response:"""