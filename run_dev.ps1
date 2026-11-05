# GhostHire Full-Stack Local Development Runner
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Starting GhostHire Full-Stack App...    " -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") + ";C:\Users\mohds\AppData\Local\Programs\NodeJS"

# Start Backend Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend Dev Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Backend running on:  http://127.0.0.1:8000 (API & Docs)" -ForegroundColor Green
Write-Host "Frontend running on: http://localhost:5173" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
