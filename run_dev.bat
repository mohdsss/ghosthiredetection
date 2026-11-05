@echo off
title GhostHire Development Launcher
cd /d "%~dp0"
echo ========================================================
echo        Starting GhostHire Full-Stack Application
echo ========================================================

set PATH=%PATH%;C:\Users\mohds\AppData\Local\Programs\NodeJS;C:\Users\mohds\AppData\Local\Programs\Python\Python313

start "GhostHire Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "GhostHire Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both services launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://127.0.0.1:8000/docs
echo ========================================================
pause
