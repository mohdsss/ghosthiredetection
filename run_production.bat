@echo off
title GhostHire Full-Stack App (FastAPI + React)
cd /d "%~dp0backend"
echo ========================================================
echo        Starting GhostHire Live Server
echo ========================================================
echo.
echo Server starting on: http://127.0.0.1:8000
echo Once started, open http://localhost:8000 in your browser!
echo.
echo Press Ctrl+C or close this window to stop the server.
echo ========================================================
echo.

venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
