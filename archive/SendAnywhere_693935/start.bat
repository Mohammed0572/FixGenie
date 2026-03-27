@echo off
echo Starting FixGenie Backend...
cd /d "%~dp0"
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo Training ML model...
python -c "from model import train_model; train_model()"
echo Starting server on http://localhost:8000/docs ^ (Ctrl+C to stop)
uvicorn main:app --reload --port 8000
pause
