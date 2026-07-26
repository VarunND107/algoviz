@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo   AlgoViz - Full Stack Launcher
echo ============================================

echo.
echo === Starting PostgreSQL (Docker) ===
docker compose up -d db
if errorlevel 1 (
    echo.
    echo Docker Compose failed. Make sure Docker Desktop is installed and running, then try again.
    pause
    exit /b 1
)

echo Waiting for Postgres to accept connections...
timeout /t 5 /nobreak >nul

echo.
echo === Launching backend (Flask, http://localhost:5000) ===
start "AlgoViz Backend" cmd /k ""%~dp0server\start-backend.cmd""

echo === Launching frontend (Vite, http://localhost:5173) ===
start "AlgoViz Frontend" cmd /k ""%~dp0client\start-frontend.cmd""

echo.
echo Waiting for the frontend dev server to boot...
timeout /t 6 /nobreak >nul

echo === Opening http://localhost:5173 in your browser ===
start "" http://localhost:5173

endlocal
