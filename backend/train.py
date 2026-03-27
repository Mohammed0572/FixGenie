import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# 1. Load dataset
print("Loading dataset...")
df = pd.read_csv(os.path.join(BASE_DIR, 'data.csv'))

# 2. Prepare features and targets
X = df['text']
y_category = df['label']
y_priority = df['priority']

# 3. TF-IDF Vectorization
print("Training TF-IDF Vectorizer...")
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_vec = vectorizer.fit_transform(X)

# 4. Train Category Model (Label)
print("\n--- Training Category Model ---")
X_train_cat, X_test_cat, y_train_cat, y_test_cat = train_test_split(X_vec, y_category, test_size=0.2, random_state=42)
model_category = LogisticRegression(random_state=42, max_iter=1000)
model_category.fit(X_train_cat, y_train_cat)
y_pred_cat = model_category.predict(X_test_cat)
print(classification_report(y_test_cat, y_pred_cat, zero_division=0))

# 5. Train Priority Model
print("\n--- Training Priority Model ---")
X_train_pri, X_test_pri, y_train_pri, y_test_pri = train_test_split(X_vec, y_priority, test_size=0.2, random_state=42)
model_priority = LogisticRegression(random_state=42, max_iter=1000)
model_priority.fit(X_train_pri, y_train_pri)
y_pred_pri = model_priority.predict(X_test_pri)
print(classification_report(y_test_pri, y_pred_pri, zero_division=0))

# 6. Save all artifacts to models/ directory
print("\nSaving models and vectorizer to disk...")
with open(os.path.join(MODELS_DIR, 'vectorizer.pkl'), 'wb') as f:
    pickle.dump(vectorizer, f)

with open(os.path.join(MODELS_DIR, 'model_category.pkl'), 'wb') as f:
    pickle.dump(model_category, f)

with open(os.path.join(MODELS_DIR, 'model_priority.pkl'), 'wb') as f:
    pickle.dump(model_priority, f)

print("✅ SUCCESS! vectorizer.pkl, model_category.pkl, and model_priority.pkl saved successfully inside /models/")
