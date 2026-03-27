# FixGenie Backend Implementation Plan

## Status: [In Progress]

### Step 1: [✅ COMPLETED] Create backend files
- `backend/main.py` (FastAPI app + CORS + /predict endpoint)
- `backend/model.py` (scikit-learn ML model training/loading)
- `backend/utils.py` (dummy data + similarity detection)
- `backend/data.py` (training dataset)

### Step 2: [✅ COMPLETED] Update requirements.txt
- Added: `joblib python-multipart uvicorn[standard]`

### Step 3: [🔄 TESTING] Test backend
- **Run**: `cd backend && python -m venv venv && venv\\Scripts\\activate && pip install -r requirements.txt && python -c \"from model import train_model; train_model()\" && uvicorn main:app --reload --port 8000`
- Visit: http://localhost:8000/docs 
- Test POST `/predict` → Expected: `{"labels": [...], "priority": "High", ...}`
- **Share terminal output after running!**

### Step 4: [TODO] Integrate with frontend
- Update Dashboard.jsx fetch to use real API (remove mock fallback temporarily)
- Test end-to-end: input → analyze → results

### Step 5: [COMPLETED] Add startup instructions to README.md
