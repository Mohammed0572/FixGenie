from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# In-memory list of previous issues
issues_db = [
    "Login button crashes app",
    "App crashes on authentication",
    "Database timeout when fetching users",
    "UI looks misaligned on mobile screen"
]

def get_similar_issues(text: str, top_n: int = 2) -> list:
    if not issues_db:
        return []
        
    corpus = [text] + issues_db
    vectorizer = TfidfVectorizer()
    
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        # Compare text (index 0) with issues_db (index 1 to end)
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        
        # Get indices of top N similarities
        top_indices = cosine_sim.argsort()[-top_n:][::-1]
        
        similar_issues = []
        for idx in top_indices:
            # Add a small threshold to avoid returning completely unrelated issues
            if cosine_sim[idx] > 0.05:
                similar_issues.append(issues_db[idx])
                
        return similar_issues
    except Exception:
        # Fallback in case of empty vocabulary or other tfidf errors
        return []

def add_issue(text: str):
    if text and text not in issues_db:
        issues_db.append(text)
