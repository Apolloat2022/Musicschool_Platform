@echo off
title Apollo Technologies - Enrollment Engine
color 0A

echo ============================================
echo   Apollo Technologies
echo   Enrollment Engine Launcher
echo ============================================
echo.

:: Pre-flight check
echo [PRE-FLIGHT] Checking internet connection...
ping -n 1 google.com >nul 2>&1
if errorlevel 1 (
    echo   [!] WARNING: No internet connection detected!
    echo       Groq API requires internet. Please connect and retry.
    pause
    exit /b 1
)
echo   [OK] Internet connection confirmed
echo   [OK] Groq runs in the cloud - no Ollama needed
echo.

:: Navigate and run
echo [STARTING] Launching Enrollment Engine...
echo.
cd /d "C:\Users\Apollo Technologies\apollo-performing-automation\Apollo-Automation"
start "Enrollment Engine" powershell -NoExit -Command "cd 'C:\Users\Apollo Technologies\apollo-performing-automation\Apollo-Automation'; python enrollment_engine.py"

echo   [OK] Enrollment Engine is running!
echo.
echo ============================================
echo   REMINDER - Pre-flight checklist:
echo   [ ] Internet connected (Groq API)
echo   [ ] Calendly booking email left UNREAD
echo   [ ] .env file has valid Groq API key
echo ============================================
echo.
pause
