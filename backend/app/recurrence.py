import chromadb
from sentence_transformers import SentenceTransformer
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))

CHROMA_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..',
    os.getenv("CHROMA_PATH", "database/chroma_db")
)
client = chromadb.PersistentClient(path=CHROMA_PATH)

collection = client.get_or_create_collection(
    name="emails_embeddings",
    metadata={"hnsw:space": "cosine"}
)

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

SEUIL_SIMILARITE = 0.75


def embed_text(text):
    return model.encode(text).tolist()


def ajouter_embedding(id_email, resume, date):
    embedding = embed_text(resume)
    collection.add(
        ids=[str(id_email)],
        embeddings=[embedding],
        documents=[resume],
        metadatas=[{"date": date}]
    )


def chercher_similaires(resume, id_email_actuel, jours=15):
    total = collection.count()
    if total == 0:
        return [], False, 0

    # ← clé du fix : jamais plus que ce qui existe
    k = min(total, 10)

    embedding   = embed_text(resume)
    date_limite = (datetime.now() - timedelta(days=jours)).isoformat()

    try:
        # ← plus de where, on filtre manuellement après
        results = collection.query(
            query_embeddings=[embedding],
            n_results=k
        )
    except Exception as e:
        print(f"⚠️ ChromaDB erreur : {e}")
        return [], False, 0

    similaires = []
    for i, doc_id in enumerate(results['ids'][0]):
        if doc_id == str(id_email_actuel):
            continue

        date_email = results['metadatas'][0][i].get("date", "")
        if date_email < date_limite:
            continue

        distance   = results['distances'][0][i]
        similarite = 1 - distance

        print(f"🔬 DEBUG → ID: {doc_id} | Similarité: {round(similarite * 100, 2)}%")

        if similarite >= SEUIL_SIMILARITE:
            similaires.append({
                "id"        : doc_id,
                "resume"    : results['documents'][0][i],
                "similarite": round(similarite * 100, 2),
                "date"      : date_email
            })

    return similaires, len(similaires) > 0, len(similaires)


def analyser_recurrence(id_email, resume, date):
    similaires, est_recurrent, nb_similaires = chercher_similaires(resume, id_email)
    ajouter_embedding(id_email, resume, date)
    return {
        "est_recurrent": est_recurrent,
        "nb_similaires": nb_similaires,
        "similaires"   : similaires
    }