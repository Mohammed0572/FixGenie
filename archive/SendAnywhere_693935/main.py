from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from model import predict
from utils import get_similar_issues, add_issue

app = FastAPI(title="FixGenie API")

# Enable CORS for React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    labels: List[str]
    priority: str
    confidence: float
    similar_issues: List[str]

@app.get("/")
def read_root():
    return {"message": "FixGenie API running"}

@app.post("/predict", response_model=PredictResponse)
def get_prediction(request: PredictRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    text = request.text.strip()
    
    try:
        # 1. Classifies bug descriptions into labels and assigns priority
        prediction = predict(text)
        
        # 2. Detects similar issues (duplicate detection)
        similar_issues = get_similar_issues(text)
        
        # 3. Store issue in memory list
        add_issue(text)
        
        return PredictResponse(
            labels=prediction["labels"],
            priority=prediction["priority"],
            confidence=prediction["confidence"],
            similar_issues=similar_issues
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
