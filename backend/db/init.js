require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("your_neon_password")) {
  console.log("⚠️ DATABASE_URL belum dikonfigurasi di file .env backend. Melewati inisialisasi database otomatis.");
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  console.log("⚙️ Initializing Neon Database Schema...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      profile_image TEXT,
      role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      icon_name VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS umkms (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
      category_id VARCHAR(50) REFERENCES categories(id),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      owner_name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      address TEXT NOT NULL,
      dusun VARCHAR(255) NOT NULL,
      operational_hours TEXT,
      whatsapp_number VARCHAR(50) NOT NULL,
      maps_url TEXT,
      instagram_url TEXT,
      image_url TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      umkm_id VARCHAR(50) REFERENCES umkms(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id VARCHAR(50) PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value TEXT NOT NULL
    );
  `;

  console.log("🌱 Seeding initial data...");

  // Seed Categories
  const categories = [
    { id: "cat-1", name: "Kuliner", slug: "kuliner", icon_name: "restaurant" },
    { id: "cat-2", name: "Kerajinan", slug: "kerajinan", icon_name: "palette" },
    { id: "cat-3", name: "Jasa", slug: "jasa", icon_name: "handyman" },
    { id: "cat-4", name: "Fashion", slug: "fashion", icon_name: "checkroom" },
    { id: "cat-5", name: "Pertanian & Peternakan", slug: "pertanian-peternakan", icon_name: "agriculture" },
  ];

  for (const c of categories) {
    await sql`
      INSERT INTO categories (id, name, slug, icon_name)
      VALUES (${c.id}, ${c.name}, ${c.slug}, ${c.icon_name})
      ON CONFLICT (slug) DO NOTHING;
    `;
  }

  // Seed Users
  const superAdminPassword = await bcrypt.hash("superadmin123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  const superAdminId = "usr-superadmin";
  const adminId = "usr-admin";

  await sql`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (${superAdminId}, 'Super Admin Desa', 'superadmin@kutoharjo.desa.id', ${superAdminPassword}, 'SUPERADMIN')
    ON CONFLICT (email) DO NOTHING;
  `;

  await sql`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (${adminId}, 'Admin Pengelola UMKM', 'admin@kutoharjo.desa.id', ${adminPassword}, 'ADMIN')
    ON CONFLICT (email) DO NOTHING;
  `;

  // Seed Site Settings
  const defaultSettings = [
    { id: "st-1", key: "site_name", value: "Kutoharjo UMKM Hub" },
    { id: "st-2", key: "hero_title", value: "Dukung Produk Lokal Desa Kutoharjo" },
    { id: "st-3", key: "hero_subtitle", value: "Temukan berbagai UMKM unggulan dari desa kami" },
  ];

  for (const s of defaultSettings) {
    await sql`
      INSERT INTO site_settings (id, key, value)
      VALUES (${s.id}, ${s.key}, ${s.value})
      ON CONFLICT (key) DO NOTHING;
    `;
  }

  console.log("✅ Database initialized & seeded successfully!");
}

initDB().catch((err) => {
  console.error("❌ Error initializing database:", err);
});
