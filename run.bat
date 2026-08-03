@echo off
title Kutoharjo UMKM Hub - Dev Server
echo ==============================================
echo Menyiapkan environment Node.js...
set PATH=C:\laragon\bin\nodejs\node-v18;%PATH%

echo Membebaskan port dan menghentikan proses Node lama...
taskkill /F /IM node.exe 2>nul

echo.
echo Memeriksa dependencies frontend...
if not exist "%~dp0frontend\node_modules" (
    echo [INFO] node_modules frontend belum ada. Memasang dependencies...
    cd /d %~dp0frontend && npm install
)

echo Memeriksa dependencies backend...
if not exist "%~dp0backend\node_modules" (
    echo [INFO] node_modules backend belum ada. Memasang dependencies...
    cd /d %~dp0backend && npm install
)

echo.
echo Memulai Backend Server (Node.js + Neon DB) di port 5000...
start "Backend Server (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

echo Memulai Frontend Server (Next.js) di port 3000...
echo Silakan buka http://localhost:3000 di browser Anda.
echo ==============================================
cd /d %~dp0frontend && npm run dev
pause
