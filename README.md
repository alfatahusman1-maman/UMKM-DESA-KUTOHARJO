# 🏪 Kutoharjo UMKM Hub

> Direktori & pusat promosi UMKM Desa Kutoharjo — platform digital untuk mendukung percepatan ekonomi lokal.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5.17-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)

## 📋 Deskripsi

Kutoharjo UMKM Hub adalah platform berbasis web yang dirancang untuk membantu masyarakat menemukan dan mendukung pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Desa Kutoharjo. Dibangun dengan **Next.js App Router**, **Tailwind CSS**, **Prisma ORM**, dan mengikuti design system "Glassmorphic-Neumorphic Hybrid".

## 🛠️ Tech Stack

| Layer      | Teknologi                                      |
|------------|-------------------------------------------------|
| Framework  | Next.js 14 (App Router)                         |
| Styling    | Tailwind CSS 3.4 + Glassmorphic-Neumorphic CSS  |
| Database   | SQLite (via Prisma ORM)                          |
| Validasi   | Zod                                              |
| State      | Zustand                                          |
| Ikon       | Lucide React                                     |
| Font       | Manrope + Hanken Grotesk (Google Fonts)          |
| Auth       | NextAuth.js *(roadmap)*                          |

## 📁 Struktur Project

```
kutoharjo-umkm-hub/
├── prisma/
│   ├── schema.prisma        # Definisi model database
│   └── seed.ts              # Data contoh (5 kategori + 6 UMKM + 1 admin)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── categories/route.ts   # GET /api/categories
│   │   │   └── umkm/
│   │   │       ├── route.ts          # GET/POST /api/umkm
│   │   │       └── [slug]/route.ts   # GET/PUT/DELETE /api/umkm/:slug
│   │   ├── umkm/
│   │   │   ├── page.tsx              # Daftar UMKM (search + filter)
│   │   │   └── [slug]/page.tsx       # Detail UMKM
│   │   ├── globals.css               # Custom utilities (neumorphic, glass)
│   │   ├── layout.tsx                # Root layout + Google Fonts
│   │   └── page.tsx                  # Landing Page
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── UmkmCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── CategoryFilter.tsx
│   └── lib/
│       ├── prisma.ts                 # Prisma Client singleton
│       ├── types.ts                  # TypeScript interfaces
│       └── utils.ts                  # Helper (formatRupiah, buildWhatsAppLink)
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## ✅ Fitur yang Sudah Diimplementasikan

### 🏠 Landing Page
- Hero section dengan CTA
- Statistik live (jumlah UMKM, kategori, dusun)
- Grid kategori usaha
- UMKM unggulan (4 UMKM terbaru terverifikasi)
- Section "Kenapa Kutoharjo UMKM Hub?"

### 📋 Daftar UMKM
- Pencarian debounced (nama, deskripsi, produk)
- Filter berdasarkan kategori
- Pagination
- Kartu UMKM dengan badge verifikasi

### 📄 Detail UMKM
- Profil lengkap UMKM
- Galeri produk dengan harga
- Tombol CTA: WhatsApp, Google Maps, Instagram
- Sidebar kontak sticky

### 🔌 REST API
- `GET /api/umkm` — List dengan search, filter kategori/dusun, pagination
- `POST /api/umkm` — Buat UMKM baru (validasi Zod)
- `GET /api/umkm/:slug` — Detail UMKM
- `PUT /api/umkm/:slug` — Update UMKM
- `DELETE /api/umkm/:slug` — Hapus UMKM
- `GET /api/categories` — Daftar kategori + jumlah UMKM

## 🚀 Menjalankan Project

### Prerequisites
- **Node.js** ≥ 18
- **npm** atau **yarn**

### Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Buat file .env (sudah tersedia, atau copy dari contoh)
cp .env.example .env

# 3. Generate Prisma Client
npx prisma generate

# 4. Buat database & tabel (SQLite otomatis)
npx prisma db push

# 5. Isi data contoh
npm run prisma:seed

# 6. Jalankan development server
npm run dev
```

Buka **http://localhost:3000** di browser Anda.

### Scripts Tersedia

| Script                | Deskripsi                          |
|-----------------------|------------------------------------|
| `npm run dev`         | Jalankan dev server                |
| `npm run build`       | Build production                   |
| `npm run start`       | Jalankan production server         |
| `npm run lint`        | Jalankan ESLint                    |
| `npm run prisma:generate` | Generate Prisma Client        |
| `npm run prisma:migrate`  | Jalankan migrasi database      |
| `npm run prisma:seed`     | Seed data contoh               |
| `npm run prisma:studio`   | Buka Prisma Studio (GUI DB)    |

## 🔐 Login Contoh (Setelah Seeding)

| Role     | Email                              | Password      |
|----------|------------------------------------|---------------|
| Admin    | `admin@kutoharjo.desa.id`          | `admin123`    |
| Merchant | `siti.keripik@kutoharjo.desa.id`   | `merchant123` |

> **Catatan:** Halaman login/register belum diimplementasikan (lihat roadmap).

## 🚧 Roadmap (Belum Dikerjakan)

- [ ] **Halaman Login/Register** — NextAuth.js credentials provider
- [ ] **Dashboard Merchant** — CRUD profil UMKM & galeri produk
- [ ] **Dashboard Super Admin** — Verifikasi UMKM, kelola semua data
- [ ] **Upload gambar** — Cloudinary integration
- [ ] **Peta digital** — Integrasi Google Maps/Leaflet

## 📄 Lisensi

© 2026 Pemerintah Desa Kutoharjo. All rights reserved.
