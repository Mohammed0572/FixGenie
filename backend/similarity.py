import os
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Reuse the vectorizer from the classifier setup for memory efficiency
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "vectorizer.pkl")

print("Initializing lightweight TF-IDF similarity engine...")
try:
    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)
except Exception as e:
    print(f"WARNING: TF-IDF Vectorizer failed to load: {e}")
    vectorizer = None

def find_similar_issues(text: str, issues: list, top_n: int = 3) -> list:
    if not vectorizer or not issues: return []
    
    # 1. Transform current bug text
    query_vec = vectorizer.transform([text.lower()])
    
    # 2. Transform all historical bugs in this session
    corpus_texts = [issue["text"].lower() for issue in issues]
    corpus_vecs = vectorizer.transform(corpus_texts)
    
    # 3. Calculate Cosine Similarity
    # Returns an array of shape (1, num_issues)
    cos_scores = cosine_similarity(query_vec, corpus_vecs)[0]
    
    ranked = sorted(enumerate(cos_scores.tolist()), key=lambda x: x[1], reverse=True)
    
    results = []
    for idx, score in ranked[:top_n]:
        # Similarity threshold: 0.15 for TF-IDF (lower than dense embeddings)
        if score > 0.15:
            issue = issues[idx]
            results.append({
                "title": issue["title"],
                "status": issue["status"],
                "date": issue["date"],
                "similarity": f"{int(score * 100)}%"
            })
    return results

def check_duplicate(text: str, issues: list) -> str:
    if not vectorizer or not issues: return "New Issue"
    
    query_vec = vectorizer.transform([text.lower()])
    corpus_texts = [issue["text"].lower() for issue in issues]
    corpus_vecs = vectorizer.transform(corpus_texts)
    
    cos_scores = cosine_similarity(query_vec, corpus_vecs)[0]
    
    # 0.80+ is a very strong match for TF-IDF
    return "Duplicate" if (len(cos_scores) > 0 and max(cos_scores) > 0.80) else "New Issue"
