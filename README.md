# 🏪 Portal UMKM Desa Korowelang Kulon & Kutoharjo

> Platform digital direktori, peta interaktif, dan pusat promosi Usaha Mikro, Kecil, dan Menengah (UMKM) desa — menghubungkan masyarakat dengan pelaku ekonomi lokal secara transparan dan mudah.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4.19-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-4169E1?logo=postgresql)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.33-C5F74F?logo=drizzle)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![Playwright](https://img.shields.io/badge/Playwright-E2E_Tests-2EAD33?logo=playwright)
![Vitest](https://img.shields.io/badge/Vitest-Unit_%26_Integration-6E9F18?logo=vitest)

---

## 📋 Deskripsi Project

**Portal UMKM Desa Korowelang Kulon & Kutoharjo** adalah aplikasi fullstack production-ready yang dirancang untuk mendukung digitalisasi UMKM desa. 

Sistem ini memfasilitasi pencarian produk lokal, pemetaan lokasi usaha secara visual via peta digital Leaflet.js, pengajuan ulasan & rating dari pengunjung, ekspor data rekapitulasi ke format Excel, serta manajemen admin yang aman dengan enkripsi Argon2id.

---

## 🛠️ Tech Stack & Arsitektur

| Layer | Teknologi Utama |
|---|---|
| **Frontend** | Next.js (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Leaflet.js |
| **Backend** | Node.js, Express.js (REST API Server) |
| **Database** | Neon PostgreSQL Serverless + Drizzle ORM *(dengan fallback in-memory local DB engine)* |
| **Security & Auth** | Enkripsi Password Argon2id, JWT (JSON Web Token), Zod Input Validation, Dynamic CORS Whitelist |
| **Media Storage** | Cloudinary SDK + Multer Memory Storage |
| **Data Export** | ExcelJS (`.xlsx` spreadsheet exporter) |
| **Automated Testing** | Vitest, Supertest (Backend), React Testing Library (Frontend), Playwright (E2E) |
| **CI/CD** | GitHub Actions Workflow (`.github/workflows/test.yml`) |

---

## ✨ Fitur-Fitur Utama

1. **Katalog UMKM & Filter Harga**: Fitur pencarian kata kunci, kategori usaha, dusun, dan filter rentang harga ("< Rp 50.000", "Rp 50rb-100rb", dst) dilengkapi dengan kontrol pagination 6 item per halaman.
2. **Badge Sertifikasi Legalitas**: Penanda lisensi resmi legalitas usaha (Halal MUI, P-IRT, BPOM, Unggulan Desa) di setiap kartu katalog dan halaman detail.
3. **Peta Interaktif Desa (Leaflet.js)**: Visualisasi posisi geografis lokasi fisik UMKM desa di atas peta digital OpenStreetMap secara interaktif tanpa ketergantungan API key berbayar.
4. **Ulasan & Rating Publik**: Pengunjung dapat memberikan rating bintang 1–5 serta komentar pengalaman belanja yang secara otomatis meng-update nilai rating rata-rata UMKM.
5. **Ekspor Data Excel (.xlsx)**: Admin dapat mengunduh rekapitulasi data UMKM, katalog produk, dan saran/masukan masyarakat dalam bentuk file spreadsheet Excel terformat.
6. **Dynamic SEO & OpenGraph**: Pratinjau otomatis (judul, deskripsi, & foto produk) saat tautan halaman UMKM dibagikan ke WhatsApp atau media sosial.
7. **Keamanan & Upload Cloudinary**: Enkripsi password menggunakan Argon2id dan upload foto produk langsung tersimpan di Cloudinary secara aman.

---

## 🧪 Pengujian Otomatis (Automated Testing)

Project ini dilengkapi dengan suite pengujian otomatis menyeluruh (Unit Test, Integration Test, dan End-to-End Test) dengan pass rate **100% GREEN**.

### Perintah Menjalankan Tes

```bash
# 1. Menjalankan Backend Integration Tests (Vitest + Supertest)
npm run test:backend

# 2. Menjalankan Frontend Component & Unit Tests (Vitest + RTL + JSDOM)
npm run test:frontend

# 3. Menjalankan Playwright End-to-End (E2E) Tests
npm run test:e2e

# 4. Menjalankan Seluruh Pipeline Pengujian Sekaligus
npm run test:all
```

---

## 🔍 Cara Pengujian Manual (Manual Testing Step-by-Step)

Untuk melakukan verifikasi dan pengujian manual terhadap seluruh fungsi aplikasi, ikuti langkah-langkah berikut:

### 1. Persiapan Server Development
Jalankan backend dan frontend secara bersamaan:

```bash
# Jalankan backend (Port 5000)
cd backend && npm run dev

# Di terminal lain, jalankan frontend (Port 3000)
cd frontend && npm run dev
```

Buka **http://localhost:3000** di browser.

### 2. Skenario Pengujian Manual (Step-by-Step Checklist)

#### A. Autentikasi Admin & Password Argon2
1. Akses halaman login di `http://localhost:3000/login`.
2. Masukkan email `superadmin@korowelangkulon.desa.id` dan password `superadmin123`.
3. **Verifikasi**: Sistem berhasil memverifikasi hash Argon2id dan mengarahkan pengguna ke Dashboard Admin (`/dashboard/admin`).
4. Coba masukkan password salah → **Verifikasi**: Pesan kesalahan `Kata sandi salah` muncul.

#### B. Upload Gambar Cloudinary & Tambah UMKM
1. Di Dashboard Admin, buka form tambah/kelola UMKM.
2. Klik tombol **Upload Gambar** dan pilih file gambar (`.jpg` / `.png`).
3. **Verifikasi**: Spinner loading aktif, gambar berhasil ter-upload ke Cloudinary, dan URL gambar ditampilkan.
4. Pilih sertifikasi legalitas (centang "Halal MUI" / "P-IRT") lalu simpan data.

#### C. Katalog, Filter Harga, & Pagination
1. Buka halaman Katalog UMKM di `http://localhost:3000/umkm`.
2. Klik filter rentang harga **"< Rp 50.000"**.
3. **Verifikasi**: URL berubah menjadi `/umkm?priceRange=under50k` dan hanya menampilkan produk di bawah Rp 50.000.
4. Cek tombol pagination di bagian bawah katalog untuk berpindah halaman.

#### D. Peta Interaktif Desa (Leaflet.js)
1. Buka menu **Peta Desa** di `http://localhost:3000/peta`.
2. **Verifikasi**: Peta Leaflet + OpenStreetMap tampil secara interaktif dengan pin marker lokasi UMKM.
3. Klik salah satu pin marker → Popup info UMKM (nama, foto, tombol detail) muncul dengan sempurna.

#### E. Pengiriman Ulasan & Rating Publik
1. Buka salah satu detail UMKM di `http://localhost:3000/umkm/bandeng-cabut-duri-mbak-lis`.
2. Gulir ke bagian bawah pada seksi **Ulasan & Rating Pelanggan**.
3. Pilih rating bintang 5, isi nama "Pengunjung Tes", masukkan komentar ulasan, lalu klik **Kirim Ulasan**.
4. **Verifikasi**: Ulasan langsung muncul di daftar ulasan dan nilai rata-rata rating UMKM ter-update.

#### F. Ekspor Laporan Excel (.xlsx)
1. Masuk ke Dashboard Admin (`http://localhost:3000/dashboard/admin`).
2. Klik tombol **Export UMKM**, **Export Produk**, atau **Export Masukan**.
3. **Verifikasi**: Browser otomatis mengunduh file `.xlsx` (misal `Rekap_UMKM_Korowelang_xxxx.xlsx`) dengan format tabel dan header terisi rapi.

---

## 🔐 Kredensial Pengujian (Default Accounts)

| Role | Email | Password Default |
|---|---|---|
| **Super Admin** | `superadmin@korowelangkulon.desa.id` | `superadmin123` |
| **Admin UMKM** | `admin@korowelangkulon.desa.id` | `admin123` |

---

## 📄 Lisensi

© 2026 Pemerintah Desa Korowelang Kulon & Kutoharjo. All rights reserved.
