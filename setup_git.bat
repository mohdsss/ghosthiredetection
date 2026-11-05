@echo off
title GhostHire - Git & GitHub Setup Helper
cd /d "%~dp0"

:: Ensure Git is in PATH
set "PATH=%PATH%;C:\Users\mohds\AppData\Local\Programs\Git\cmd"

echo ========================================================
echo        GhostHire GitHub Repository Setup
echo ========================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git was not found. Please install Git or GitHub Desktop.
    pause
    exit /b
)

echo [OK] Git is ready!
git branch -M main

echo.
echo ========================================================
echo Step 1: Go to https://github.com/new in your browser
echo Step 2: Name your repository (e.g. ghosthire)
echo Step 3: Do NOT check 'Add README' or '.gitignore'
echo Step 4: Click 'Create repository' and copy the URL
echo ========================================================
echo.

set /p REPO_URL="Paste your GitHub Repo URL here (e.g. https://github.com/yourname/ghosthire.git): "
if "%REPO_URL%"=="" (
    echo No URL entered. Exiting.
    pause
    exit /b
)

echo.
echo Linking to %REPO_URL% ...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Pushing code to GitHub main branch...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] PUSHED TO GITHUB SUCCESSFULLY!
    echo  Next: Go to vercel.com -> Import this repo -> Deploy!
    echo ========================================================
) else (
    echo.
    echo [NOTE] If GitHub asked you to sign in, please complete the browser login prompt.
)
echo.
pause
