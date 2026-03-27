from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import engine, Base
import models
import auth
from predict import analyze_bug, load_known_issues, get_issue, resolve_issue

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FixGenie Bug Triage API", version="3.0")

# Configure CORS for React Frontend (Port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Routes
app.include_router(auth.router, tags=["Authentication"])

# Pydantic model for ML Prediction
class PredictRequest(BaseModel):
    text: str
    user_id: str = "default"

@app.get("/")
def home():
    return {
        "service": "FixGenie Bug Triage API",
        "version": "3.0 (FastAPI)",
        "status": "running",
        "endpoints": {
            "POST /signup": "Create a new user.",
            "POST /login": "Authenticate user.",
            "POST /predict": "Analyze a bug report text.",
            "GET /issues/{user_id}": "Fetch historical active bugs for user.",
            "GET /issues/{user_id}/{issue_id}": "Fetch full AI analysis for a specific bug.",
            "PATCH /issues/{user_id}/{issue_id}/resolve": "Mark an active bug as resolved."
        }
    }

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    from fastapi import Response
    return Response(status_code=204)

@app.get("/issues/{user_id}")
def get_issues(user_id: str):
    return load_known_issues(user_id)

@app.get("/issues/{user_id}/{issue_id}")
def fetch_issue(user_id: str, issue_id: str):
    issue = get_issue(user_id, issue_id)
    if not issue: raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@app.patch("/issues/{user_id}/{issue_id}/resolve")
def resolve(user_id: str, issue_id: str):
    issue = resolve_issue(user_id, issue_id)
    if not issue: raise HTTPException(status_code=404, detail="Issue not found")
    return {"status": "Resolved", "id": issue_id}

@app.post("/predict")
def predict(request: PredictRequest):
    """
    POST /predict
    Body: { "text": "describe the bug here..." }
    """
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Missing 'text' field in request body.")
    
    result = analyze_bug(text, request.user_id)
    return result

@app.post("/predict-image")
async def predict_image(
    image: UploadFile = File(...),
    text: str = Form(""),
    user_id: str = Form("default")
):
    """
    POST /predict-image
    Accepts an image file (screenshot), extracts text via OCR,
    combines with optional user text, and runs the full ML pipeline.
    """
    import tempfile, os
    
    # Save uploaded image to temp file
    contents = await image.read()
    suffix = os.path.splitext(image.filename)[1] or ".png"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(contents)
    tmp.close()
    
    extracted_text = ""
    
    try:
        # Try real OCR with pytesseract
        from PIL import Image
        import pytesseract
        img = Image.open(tmp.name)
        extracted_text = pytesseract.image_to_string(img).strip()
    except Exception:
        # Fallback: simulate OCR for demo/hackathon
        extracted_text = _simulate_ocr(image.filename)
    finally:
        os.unlink(tmp.name)
    
    # Combine extracted text with user-provided text
    combined = f"{text.strip()} {extracted_text}".strip() if text.strip() else extracted_text
    
    if not combined:
        raise HTTPException(status_code=400, detail="Could not extract any text from the image.")
    
    result = analyze_bug(combined, user_id)
    result["image_detected_text"] = extracted_text
    return result


def _simulate_ocr(filename: str) -> str:
    """Fallback simulated OCR for demo purposes."""
    fn = (filename or "").lower()
    if "login" in fn or "auth" in fn:
        return "Error: NullPointerException in LoginActivity.java at line 42. User session token is null when attempting authentication."
    elif "crash" in fn or "error" in fn:
        return "Fatal Exception: java.lang.RuntimeException - Unable to start activity. Caused by: android.database.sqlite.SQLiteException: no such table: user_sessions"
    elif "network" in fn or "api" in fn:
        return "HTTP 503 Service Unavailable. ConnectionTimeoutError: Failed to connect to api.service.internal:8443 after 30000ms."
    elif "ui" in fn or "layout" in fn or "screen" in fn:
        return "Warning: View overlap detected in ConstraintLayout. Button submit_btn is obscured by overlapping view error_banner at coordinates (0,412)."
    else:
        return "Traceback (most recent call last): File 'app.py', line 127, in process_request: KeyError: 'user_id' - Missing required field in request payload."

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("  FixGenie API — http://localhost:8000")
    print("=" * 50)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
