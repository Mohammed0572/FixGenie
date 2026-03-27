from sentence_transformers import SentenceTransformer, util

# Initialize eagerly globally
print("Initializing sentence-transformers semantic engine...")
try:
    similarity_model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    print(f"WARNING: SentenceTransformer model failed to load. Ensure pytorch is installed. Err: {e}")
    similarity_model = None

def find_similar_issues(text: str, issues: list, top_n: int = 3) -> list:
    if not similarity_model or not issues: return []
    
    corpus = [issue["text"] for issue in issues]
    query_embedding = similarity_model.encode(text, convert_to_tensor=True)
    corpus_embeddings = similarity_model.encode(corpus, convert_to_tensor=True)
    
    # Compute dot/cosine similarities natively
    cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
    
    ranked = sorted(enumerate(cos_scores.tolist()), key=lambda x: x[1], reverse=True)
    
    results = []
    for idx, score in ranked[:top_n]:
        # Semantic strings sit higher on cosine margins than sparse TF-IDF strings
        if score > 0.40:
            issue = issues[idx]
            results.append({
                "title": issue["title"],
                "status": issue["status"],
                "date": issue["date"],
                "similarity": f"{int(score * 100)}%"
            })
    return results

def check_duplicate(text: str, issues: list) -> str:
    if not similarity_model or not issues: return "New Issue"
    
    corpus = [issue["text"] for issue in issues]
    query_embedding = similarity_model.encode(text, convert_to_tensor=True)
    corpus_embeddings = similarity_model.encode(corpus, convert_to_tensor=True)
    cos_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]
    
    return "Duplicate" if max(cos_scores).item() > 0.85 else "New Issue"
