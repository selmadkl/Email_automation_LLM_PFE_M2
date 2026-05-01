import numpy as np

# ============================================================
# 1. POIDS DES CRITÈRES (Issus de ta Matrice 1)
# ============================================================
W_URGENCE   = 0.4896
W_PROFIL    = 0.3054
W_CATEGORIE = 0.1264
W_SOUSCAT   = 0.0786

# ============================================================
# 2. POIDS DES VALEURS (Normalisés pour garder une échelle cohérente)
# ============================================================
# Matrice 2 : Urgence
SCORE_URGENCE = {"Haute": 0.7014, "Moyenne": 0.1932, "Basse": 0.1054}

# Matrice 3 : Profil
SCORE_PROFIL = {"Hiérarchie": 0.4673, "Enseignant": 0.2625, "Étudiant": 0.1601, "Externe": 0.1101}

# Matrice 4 : Catégorie
SCORE_CAT = {
    "Demande_Administrative": 0.4661, 
    "Demande_Pédagogique": 0.2621,
    "Support_Technique": 0.1603, 
    "Partenariat": 0.1115
}

# Matrice 5 : Sous-Catégorie (Top 4 pour l'exemple, à compléter selon ta matrice)
SCORE_SOUSCAT = {
    "Directives_Hiérarchie": 0.3248,
    "Suivi_Examens": 0.2078,
    "Scolarité_Etudiant": 0.1415,
    "Encadrement_FinDeCycle": 0.0989,
    "Gestion_Personnel": 0.0734,
    "Organisation_Enseignements": 0.0558,
    "Logistique_Administrative": 0.0435,
    "Offres_Formation": 0.0343
}

# ============================================================
# 3. RÈGLES FIXES (Sécurité Institutionnelle)
# ============================================================
REGLES_HAUTE = [
    ("Demande_Administrative", "Directives_Hiérarchie"),
    ("Demande_Pédagogique",    "Suivi_Examens"),
    ("Demande_Administrative", "Scolarité_Etudiant"),
]

def calculer_priorite(urgence_llm: str, categorie: str, 
                      sous_categorie: str, profil: str) -> dict:
    """
    Intégration Totale AHP : 4 dimensions + Hard Rules.
    """
    urg_cap = urgence_llm.capitalize() if urgence_llm else "Moyenne"

    # --- ÉTAPE 1 : VÉRIFICATION DES RÈGLES FIXES ---
    for cat, sc in REGLES_HAUTE:
        if categorie == cat and sous_categorie == sc:
            return {"priorite": "Haute", "score": 1.0} # Score max par règle
    
    # Cas spécial Support Technique pour les profils prioritaires
    if categorie == "Support_Technique" and profil in ["Hiérarchie", "Enseignant"]:
        return {"priorite": "Haute", "score": 0.9}

    # --- ÉTAPE 2 : CALCUL DU SCORE AHP GLOBAL ---
    # Somme pondérée de chaque dimension par son importance (Matrice 1)
    # Score = Σ (Poids_Critère * Score_Valeur)
    
    score_final = (
        W_URGENCE   * SCORE_URGENCE.get(urg_cap, 0.19) +
        W_PROFIL    * SCORE_PROFIL.get(profil, 0.16) +
        W_CATEGORIE * SCORE_CAT.get(categorie, 0.11) +
        W_SOUSCAT   * SCORE_SOUSCAT.get(sous_categorie, 0.03)
    )

    # --- ÉTAPE 3 : CLASSIFICATION PAR SEUILLS ---
    # Seuils basés sur la distribution théorique des poids
    if score_final >= 0.3298:
        priorite = "Haute"
    elif score_final >= 0.1851:
        priorite = "Moyenne"
    else:
        priorite = "Basse"

    return {
        "priorite": priorite,
        "score": round(score_final, 4)
    }