@echo off
title CaseGen Pro Launcher
echo ============================================
echo    CaseGen Pro - Local UI and API Test Generator
echo ============================================
echo.
echo [1/3] Starting Backend API Server on port 3000...
start cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 4 /nobreak >nul
echo [2/3] Starting Frontend Server on port 5173...
start cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 5 /nobreak >nul
echo [3/3] Opening CaseGen Pro in your browser...
start http://localhost:5173
echo.
echo ============================================
echo  CaseGen Pro is running!
echo  Backend  : http://localhost:3000
echo  Frontend : http://localhost:5173
echo ============================================
echo  TIP: Close the two server windows to stop the servers.
pause
