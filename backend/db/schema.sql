-- Schema for Neon Database (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  profile_image TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  icon_name VARCHAR(255) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  umkm_id VARCHAR(50) REFERENCES umkms(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(50) PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_umkms_category_id ON umkms(category_id);
CREATE INDEX IF NOT EXISTS idx_umkms_dusun ON umkms(dusun);
CREATE INDEX IF NOT EXISTS idx_products_umkm_id ON products(umkm_id);
