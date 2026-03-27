import os
import pickle

# ── Paths ─────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ── Load ML Models ────────────────────────────────────────────────────
try:
    model_category = pickle.load(open(os.path.join(MODELS_DIR, "model_category.pkl"), "rb"))
    model_priority = pickle.load(open(os.path.join(MODELS_DIR, "model_priority.pkl"), "rb"))
    vectorizer = pickle.load(open(os.path.join(MODELS_DIR, "vectorizer.pkl"), "rb"))
except FileNotFoundError:
    print("WARNING: Models not found! Please run 'python train.py' first.")
    model_category, model_priority, vectorizer = None, None, None

def predict_category(text: str) -> str:
    if not model_category: return "UI"
    vec = vectorizer.transform([text.lower()])
    return model_category.predict(vec)[0]

def predict_priority(text: str) -> str:
    if not model_priority: return "Low"
    vec = vectorizer.transform([text.lower()])
    return model_priority.predict(vec)[0]

def compute_confidence(text: str) -> int:
    if not model_category: return 85
    vec = vectorizer.transform([text.lower()])
    probas = model_category.predict_proba(vec)[0]
    return int(round(max(probas) * 100))
