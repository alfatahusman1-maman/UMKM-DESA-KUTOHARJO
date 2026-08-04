const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const DATA_FILE = path.join(__dirname, "data.json");

function getInitialData() {
  const superAdminPassword = bcrypt.hashSync("superadmin123", 10);
  const adminPassword = bcrypt.hashSync("admin123", 10);

  return {
    users: [
      {
        id: "usr-superadmin",
        name: "Super Admin Desa Korowelang",
        email: "superadmin@korowelangkulon.desa.id",
        password_hash: superAdminPassword,
        role: "SUPERADMIN",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-admin",
        name: "Admin Pengelola UMKM",
        email: "admin@korowelangkulon.desa.id",
        password_hash: adminPassword,
        role: "ADMIN",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-superadmin-kutoharjo",
        name: "Super Admin Desa Kutoharjo",
        email: "superadmin@kutoharjo.desa.id",
        password_hash: superAdminPassword,
        role: "SUPERADMIN",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-admin-kutoharjo",
        name: "Admin Kutoharjo",
        email: "admin@kutoharjo.desa.id",
        password_hash: adminPassword,
        role: "ADMIN",
        created_at: new Date().toISOString(),
      },
    ],
    categories: [
      { id: "cat-1", name: "Kuliner", slug: "kuliner", icon_name: "restaurant" },
      { id: "cat-2", name: "Kerajinan", slug: "kerajinan", icon_name: "palette" },
      { id: "cat-3", name: "Jasa", slug: "jasa", icon_name: "handyman" },
      { id: "cat-4", name: "Fashion", slug: "fashion", icon_name: "checkroom" },
      { id: "cat-5", name: "Pertanian & Peternakan", slug: "pertanian-peternakan", icon_name: "agriculture" },
    ],
    site_settings: [
      { id: "st-1", key: "site_name", value: "Kutoharjo UMKM Hub" },
      { id: "st-2", key: "hero_title", value: "Temukan & Dukung UMKM Lokal Desa Kutoharjo" },
      { id: "st-3", key: "hero_subtitle", value: "Direktori digital yang menghubungkan Anda langsung dengan pelaku usaha mikro, kecil, dan menengah di Desa Kutoharjo. Beli lokal, tumbuh bersama." },
    ],
    umkms: [],
    products: [],
    reviews: [],
  };
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = getInitialData();
    saveData(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.reviews) parsed.reviews = [];
    return parsed;
  } catch (err) {
    console.error("Error loading local data file, re-initializing...", err);
    const initial = getInitialData();
    saveData(initial);
    return initial;
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving local data file:", err);
  }
}

// SQL Query Executor Engine for Local Storage
async function executeLocalSql(strings, values) {
  const data = loadData();
  const rawQuery = Array.isArray(strings)
    ? strings.reduce((acc, str, i) => acc + str + (values[i] !== undefined ? `$${i + 1}` : ""), "")
    : strings;
  const q = rawQuery.trim();

  // 1. SELECT version()
  if (/SELECT version\(\)/i.test(q)) {
    return [{ version: "PostgreSQL 16.0 (Local DB Storage Fallback)" }];
  }

  // 2. USERS Queries
  if (/FROM users/i.test(q)) {
    if (/SELECT COUNT/i.test(q)) {
      return [{ count: data.users.length }];
    }
    if (/WHERE email =/i.test(q)) {
      const emailVal = values[0];
      const found = data.users.filter((u) => u.email.toLowerCase() === (emailVal || "").toLowerCase());
      return found;
    }
    if (/WHERE id =/i.test(q)) {
      const idVal = values[0];
      const found = data.users.filter((u) => u.id === idVal);
      return found;
    }
    return data.users;
  }

  if (/INSERT INTO users/i.test(q)) {
    const [id, name, email, password_hash, role] = values;
    const newUser = {
      id: id || "usr-" + crypto.randomBytes(8).toString("hex"),
      name,
      email,
      password_hash,
      role: role || "ADMIN",
      created_at: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveData(data);
    return [newUser];
  }

  // 3. CATEGORIES Queries
  if (/FROM categories/i.test(q)) {
    const result = data.categories.map((c) => {
      const count = data.umkms.filter((u) => u.category_id === c.id && u.is_verified).length;
      return {
        ...c,
        cat_id: c.id,
        cat_name: c.name,
        cat_slug: c.slug,
        cat_icon: c.icon_name,
        umkm_count: count,
      };
    });
    return result;
  }

  // 4. SITE SETTINGS Queries
  if (/FROM site_settings/i.test(q)) {
    return data.site_settings;
  }

  if (/INSERT INTO site_settings/i.test(q)) {
    const [id, key, value] = values;
    const idx = data.site_settings.findIndex((s) => s.key === key);
    if (idx >= 0) {
      data.site_settings[idx].value = value;
    } else {
      data.site_settings.push({ id: id || "st-" + Date.now(), key, value });
    }
    saveData(data);
    return [{ key, value }];
  }

  // REVIEWS Queries
  if (/FROM reviews/i.test(q)) {
    const umkmIdVal = values[0];
    const filtered = (data.reviews || []).filter((r) => String(r.umkm_id) === String(umkmIdVal));
    return filtered.map((r) => ({
      ...r,
      createdAt: r.created_at,
    }));
  }

  if (/INSERT INTO reviews/i.test(q)) {
    const [id, umkm_id, name, rating, comment] = values;
    const newRev = {
      id: id || "rev-" + crypto.randomBytes(6).toString("hex"),
      umkm_id,
      name,
      rating: Number(rating),
      comment,
      created_at: new Date().toISOString(),
    };
    if (!data.reviews) data.reviews = [];
    data.reviews.unshift(newRev);
    saveData(data);
    return [{
      ...newRev,
      createdAt: newRev.created_at,
    }];
  }

  // 5. UMKMS Queries
  if (/FROM umkms/i.test(q)) {
    let filtered = [...data.umkms];

    if (/WHERE u\.slug =/i.test(q) || /WHERE slug =/i.test(q)) {
      const slugVal = values[0];
      filtered = filtered.filter((u) => u.slug === slugVal || String(u.id) === String(slugVal));
    } else if (/WHERE id =/i.test(q) || /WHERE u\.id =/i.test(q)) {
      const idVal = values[0];
      filtered = filtered.filter((u) => String(u.id) === String(idVal));
    } else {
      if (/u\.is_verified = TRUE/i.test(q) || /is_verified = TRUE/i.test(q)) {
        filtered = filtered.filter((u) => u.is_verified === true);
      } else if (/u\.is_verified = FALSE/i.test(q) || /is_verified = FALSE/i.test(q)) {
        filtered = filtered.filter((u) => u.is_verified === false);
      }
    }

    if (/SELECT COUNT/i.test(q)) {
      return [{ total: filtered.length, count: filtered.length }];
    }

    const formatted = filtered.map((u) => {
      const cat = data.categories.find((c) => c.id === u.category_id);
      return {
        ...u,
        userId: u.user_id,
        categoryId: u.category_id,
        ownerName: u.owner_name,
        operationalHours: u.operational_hours,
        whatsappNumber: u.whatsapp_number,
        mapsUrl: u.maps_url,
        instagramUrl: u.instagram_url,
        imageUrl: u.image_url,
        isVerified: u.is_verified,
        certifications: u.certifications || [],
        rating: u.rating || "0.00",
        reviewCount: u.review_count || 0,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
        cat_id: cat?.id || null,
        cat_name: cat?.name || null,
        cat_slug: cat?.slug || null,
        cat_icon: cat?.icon_name || null,
        category_name: cat?.name || null,
      };
    });

    return formatted;
  }

  if (/INSERT INTO umkms/i.test(q)) {
    const [
      id, user_id, category_id, name, slug, owner_name, description, address, dusun,
      operational_hours, whatsapp_number, maps_url, instagram_url, image_url
    ] = values;

    const newUmkm = {
      id: id || "umkm-" + crypto.randomBytes(8).toString("hex"),
      user_id: user_id || "usr-admin",
      category_id: category_id || "cat-1",
      name: name || "UMKM Baru",
      slug: slug || "umkm-baru",
      owner_name: owner_name || "Pemilik UMKM",
      description: description || "Deskripsi UMKM Baru",
      address: address || "Alamat UMKM",
      dusun: dusun || "Kutoharjo",
      operational_hours: operational_hours || null,
      whatsapp_number: whatsapp_number || "6281234567890",
      maps_url: maps_url || null,
      instagram_url: instagram_url || null,
      image_url: image_url || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    data.umkms.unshift(newUmkm);
    saveData(data);
    return [newUmkm];
  }

  if (/UPDATE umkms/i.test(q)) {
    if (/is_verified = TRUE/i.test(q) && /WHERE id =/i.test(q)) {
      const idVal = values[0];
      const target = data.umkms.find((u) => String(u.id) === String(idVal));
      if (target) {
        target.is_verified = true;
        target.updated_at = new Date().toISOString();
        saveData(data);
        return [target];
      }
      return [];
    }

    if (/WHERE slug =/i.test(q) || /WHERE id =/i.test(q)) {
      const slugVal = values[values.length - 1];
      const target = data.umkms.find((u) => u.slug === slugVal || String(u.id) === String(slugVal));
      if (target) {
        target.updated_at = new Date().toISOString();
        saveData(data);
        return [target];
      }
      return [];
    }

    return [];
  }

  if (/DELETE FROM umkms/i.test(q)) {
    const val = values[0];
    const initialLen = data.umkms.length;
    data.umkms = data.umkms.filter((u) => u.slug !== val && String(u.id) !== String(val));
    data.products = data.products.filter((p) => String(p.umkm_id) !== String(val));
    saveData(data);
    return [{ success: data.umkms.length < initialLen }];
  }

  // 6. PRODUCTS Queries
  if (/FROM products/i.test(q)) {
    const umkmIdVal = values[0];
    let prods = [...data.products];

    if (/WHERE umkm_id =/i.test(q)) {
      prods = prods.filter((p) => String(p.umkm_id) === String(umkmIdVal));
    } else if (/WHERE id =/i.test(q)) {
      prods = prods.filter((p) => String(p.id) === String(umkmIdVal));
    }

    return prods.map((p) => ({
      ...p,
      umkmId: p.umkm_id,
      imageUrl: p.image_url,
      createdAt: p.created_at,
    }));
  }

  if (/INSERT INTO products/i.test(q)) {
    const [id, umkm_id, title, price, description, image_url] = values;
    const newProd = {
      id: id || "prod-" + crypto.randomBytes(8).toString("hex"),
      umkm_id,
      title,
      price: Number(price || 0),
      description,
      image_url,
      created_at: new Date().toISOString(),
    };
    data.products.unshift(newProd);
    saveData(data);
    return [{
      ...newProd,
      umkmId: newProd.umkm_id,
      imageUrl: newProd.image_url,
      createdAt: newProd.created_at,
    }];
  }

  if (/DELETE FROM products/i.test(q)) {
    const idVal = values[0];
    data.products = data.products.filter((p) => String(p.id) !== String(idVal));
    saveData(data);
    return [{ success: true }];
  }

  return [];
}

module.exports = { executeLocalSql, loadData, saveData };
