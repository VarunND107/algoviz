@echo off
cd /d "%~dp0"

if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

echo Starting Vite dev server on http://localhost:5173 ...
npm run dev

pause
