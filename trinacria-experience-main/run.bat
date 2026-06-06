@echo off
REM Run Trinacria Experience Project
REM This script sets up Node.js path and runs the dev server

set NODE_PATH=C:\Users\Utente\Downloads\node-v24.15.0-win-x64\node-v24.15.0-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "%~dp0"

echo Installing dependencies...
call "%NODE_PATH%\npm.cmd" install

if errorlevel 1 (
    echo Installation failed!
    pause
    exit /b 1
)

echo.
echo Starting development server...
call "%NODE_PATH%\npm.cmd" run dev

pause
