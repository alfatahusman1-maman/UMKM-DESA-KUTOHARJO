@echo off
setlocal enabledelayedexpansion
title Push to GitHub - Kutoharjo UMKM Hub
echo ==============================================
echo Mempersiapkan file untuk di-push ke GitHub...
echo ==============================================

:: Memastikan git sudah diinisialisasi
if not exist ".git" (
    echo Menginisialisasi repositori Git baru...
    git init
)

:: Mendaftarkan remote origin jika belum
git remote add origin https://github.com/alfatahusman1-maman/UMKM-DESA-KUTOHARJO.git 2>nul
git branch -M main

:: Tambahkan semua file yang berubah
git add .

:: Cek apakah ada perubahan
git status --porcelain | findstr /R "." >nul
if errorlevel 1 (
    echo.
    echo [INFO] Tidak ada perubahan baru yang perlu di-commit.
    echo Memastikan semua commit lokal sudah terunggah...
) else (
    echo.
    set "commitMsg="
    set /p commitMsg="Masukkan pesan commit (tekan Enter untuk 'Pembaruan kode'): "
    if "!commitMsg!"=="" set "commitMsg=Pembaruan kode"
    git commit -m "!commitMsg!"
)

:: Melakukan pull untuk menyinkronkan dengan GitHub
echo.
echo Menyinkronkan dengan GitHub...
git pull origin main --rebase --allow-unrelated-histories

:: Melakukan push ke origin main
echo.
echo Sedang mengunggah ke GitHub...
git push -u origin main

echo.
echo ==============================================
echo Selesai! Kode di GitHub sudah versi terbaru.
echo ==============================================
pause
