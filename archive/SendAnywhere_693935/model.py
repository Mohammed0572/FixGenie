from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import numpy as np

# A small hardcoded dataset
TRAIN_DATA = [
    ("App crashes on login", "bug", "High"),
    ("Cannot authenticate user", "bug", "High"),
    ("Button color is wrong", "enhancement", "Low"),
    ("Page loads slowly", "performance", "Medium"),
    ("Typo in the title", "bug", "Low"),
    ("Database connection fails", "bug", "High"),
    ("Add dark mode", "feature", "Medium"),
    ("UI looks misaligned on mobile", "frontend", "Medium")
]

train_texts = [item[0] for item in TRAIN_DATA]
train_labels = [item[1] for item in TRAIN_DATA]
train_priorities = [item[2] for item in TRAIN_DATA]

vectorizer = TfidfVectorizer()
X_train = vectorizer.fit_transform(train_texts)

# We use logistic regression to predict label and priority
label_clf = LogisticRegression(class_weight='balanced')
label_clf.fit(X_train, train_labels)

priority_clf = LogisticRegression(class_weight='balanced')
priority_clf.fit(X_train, train_priorities)

def predict(text):
    if not text:
        return {"labels": ["unknown"], "priority": "Medium", "confidence": 0.0}
        
    X_test = vectorizer.transform([text])
    
    label_pred = label_clf.predict(X_test)[0]
    priority_pred = priority_clf.predict(X_test)[0]
    
    # Calculate a mock confidence score based on probabilities
    label_prob = np.max(label_clf.predict_proba(X_test))
    priority_prob = np.max(priority_clf.predict_proba(X_test))
    
    confidence = round(float((label_prob + priority_prob) / 2), 2)
    
    # For demonstration, we append a secondary label based on simple rules
    secondary_label = "frontend" if any(w in text.lower() for w in ["ui", "button", "screen"]) else "backend"
    
    return {
        "labels": [label_pred, secondary_label],
        "priority": priority_pred,
        "confidence": confidence
    }
