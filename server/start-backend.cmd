@echo off
cd /d "%~dp0"

if not exist venv (
    echo Creating virtual environment...
    py -m venv venv
)

call venv\Scripts\activate.bat

echo Installing/checking backend dependencies...
pip install -r requirements.txt --quiet

set DATABASE_URL=postgresql://algoviz:algoviz@localhost:5432/algoviz
set JWT_SECRET_KEY=dev-secret-change-me
set CORS_ORIGINS=http://localhost:5173

echo Starting Flask backend on http://localhost:5000 ...
python run.py

pause
