@echo off
title Music Player - Project Manager
setlocal enabledelayedexpansion

:MENU
cls
echo =======================================================
echo          MUSIC PLAYER - PROJECT CONTROL PANEL
echo =======================================================
echo  [1] Start Development Server (npm run dev)
echo  [2] Stop Running Server / Processes
echo  [3] Install / Reinstall Dependencies (npm install)
echo  [4] Build Project for Production (npm run build)
echo  [5] Preview Production Build (npm run preview)
echo  [6] Open Project Folder in Explorer
echo  [7] Exit
echo =======================================================
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto START_SERVER
if "%choice%"=="2" goto STOP_SERVER
if "%choice%"=="3" goto INSTALL_DEPS
if "%choice%"=="4" goto BUILD_PROJECT
if "%choice%"=="5" goto PREVIEW_BUILD
if "%choice%"=="6" goto OPEN_EXPLORER
if "%choice%"=="7" goto EXIT_SCRIPT

echo.
echo Invalid choice, please try again.
pause
goto MENU

:START_SERVER
cls
echo Starting Music Player development server...
echo.
start "" http://localhost:5173
npm run dev
pause
goto MENU

:STOP_SERVER
cls
echo Stopping running Node / Vite processes...
echo.
taskkill /F /IM node.exe /T 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Successfully stopped running server processes.
) else (
    echo No active Node/Vite processes found running.
)
echo.
pause
goto MENU

:INSTALL_DEPS
cls
echo Installing dependencies...
echo.
call npm install
echo.
echo Dependencies installed successfully.
pause
goto MENU

:BUILD_PROJECT
cls
echo Building production bundle...
echo.
call npm run build
echo.
pause
goto MENU

:PREVIEW_BUILD
cls
echo Previewing production build...
echo.
start "" http://localhost:4173
call npm run preview
pause
goto MENU

:OPEN_EXPLORER
explorer "%~dp0"
goto MENU

:EXIT_SCRIPT
echo Exiting...
exit /b 0

