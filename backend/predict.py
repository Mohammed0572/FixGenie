import os
import json
import uuid
from datetime import datetime

from classifier import predict_category, predict_priority, compute_confidence
from similarity import find_similar_issues, check_duplicate
from analysis import generate_analysis, generate_debug_steps

HISTORICAL_BUGS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "historical_bugs.json")

# ── History & File Logic ──────────────────────────────────────────────
def load_known_issues(user_id="default"):
    if os.path.exists(HISTORICAL_BUGS_FILE):
        try:
            with open(HISTORICAL_BUGS_FILE, "r") as f:
                data = json.load(f)
                if isinstance(data, list):
                    data = {"default": data}
                return data.get(user_id, [])
        except json.JSONDecodeError:
            return []
    # Default seed
    seed_data = []
    save_known_issues(seed_data, "default")
    return seed_data if user_id == "default" else []

def save_known_issues(issues, user_id="default"):
    data = {}
    if os.path.exists(HISTORICAL_BUGS_FILE):
        try:
            with open(HISTORICAL_BUGS_FILE, "r") as f:
                data = json.load(f)
                if isinstance(data, list):
                    data = {"default": data}
        except json.JSONDecodeError:
            pass
    data[user_id] = issues
    with open(HISTORICAL_BUGS_FILE, "w") as f:
        json.dump(data, f, indent=4)

def add_issue_to_history(text: str, category: str, full_payload: dict, user_id="default"):
    issues = load_known_issues(user_id)
    new_id = str(uuid.uuid4())
    full_payload["id"] = new_id
    issues.append({
        "id": new_id,
        "text": text,
        "title": text[:50] + "..." if len(text) > 50 else text,
        "status": "Active",
        "date": datetime.now().strftime("%b %d, %Y"),
        "analysis": full_payload
    })
    save_known_issues(issues, user_id)

def resolve_issue(user_id: str, issue_id: str):
    issues = load_known_issues(user_id)
    for issue in issues:
        if issue.get("id") == issue_id:
            issue["status"] = "Resolved"
            save_known_issues(issues, user_id)
            return issue.get("analysis")
    return None

def get_issue(user_id: str, issue_id: str):
    issues = load_known_issues(user_id)
    for issue in issues:
        if issue.get("id") == issue_id:
            return issue.get("analysis")
    return None

# ── Main Entry ────────────────────────────────────────────────────────
def analyze_bug(text: str, user_id="default") -> dict:
    # 1. Fetch contextual cache array
    historical_issues = load_known_issues(user_id)
    
    # 2. Pipeline -> Classification
    category = predict_category(text)
    priority = predict_priority(text)
    confidence = compute_confidence(text)
    
    # 3. Pipeline -> Similarity
    duplicate = check_duplicate(text, historical_issues)
    similar_issues = find_similar_issues(text, historical_issues, top_n=3)
    
    # 4. Pipeline -> Prompts / Analysis
    analysis_blocks = generate_analysis(text, similar_issues)
    debug_steps = generate_debug_steps(text)

    # Sub-labels for UI aesthetics
    label_variants = {
        "UI": ["UI/UX", "Frontend", "Visual"],
        "Backend": ["Backend", "Server", "API"],
        "Performance": ["Performance", "Latency", "Optimization"],
    }
    labels = label_variants.get(category, [category])

    # 5. Build Unified Payload
    payload = {
        "category": category,
        "labels": labels,
        "priority": priority,
        "confidence": confidence,
        "duplicate": duplicate,
        "title": text[:60] if len(text) > 10 else "Bug Report Analysis",
        "description": f"The FixGenie NLP pipeline classified this as a {category} issue with {priority} priority. Context: {duplicate}.",
        "similar_issues": similar_issues,
        "root_cause": analysis_blocks["root_cause"],
        "fix_steps": analysis_blocks["fix_steps"],
        "prevention": analysis_blocks["prevention"],
        "debug_steps": debug_steps
    }
    
    # 6. Store dynamically
    add_issue_to_history(text, category, payload, user_id)

    return payload
