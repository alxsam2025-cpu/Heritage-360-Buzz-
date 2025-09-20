@echo off
echo ==========================================
echo Heritage 360 Buzz - Quick Deployment
echo ==========================================
echo.

echo [1/6] Checking Git installation...
git --version
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/windows
    echo Then restart this script.
    pause
    exit /b 1
)

echo [2/6] Initializing Git repository...
git init

echo [3/6] Configuring Git...
git config --global user.name "Samuel Adu"
echo Please enter your email address:
set /p EMAIL=Email: 
git config --global user.email %EMAIL%

echo [4/6] Adding all files...
git add .

echo [5/6] Creating commit...
git commit -m "Heritage 360 Buzz System - Mobile Optimized for Production"

echo [6/6] Setting up remote and pushing...
git branch -M main
git remote add origin https://github.com/alxsam2025-cpu/Heritage-360-Buzz-.git
git push -u origin main

echo.
echo ==========================================
echo ✅ DEPLOYMENT COMPLETED!
echo ==========================================
echo.
echo Your code is now on GitHub at:
echo https://github.com/alxsam2025-cpu/Heritage-360-Buzz-
echo.
echo Next steps:
echo 1. Deploy backend to Railway: https://railway.app
echo 2. Deploy frontend to Vercel: https://vercel.com
echo.
echo Your permanent URLs will be:
echo - Frontend: https://heritage-360-buzz.vercel.app
echo - Backend: https://heritage-360-buzz-api.up.railway.app
echo.
echo See DEPLOY_HERITAGE_360_BUZZ.md for complete instructions.
echo.
pause