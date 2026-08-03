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
        name: "Super Admin Desa",
        email: "superadmin@kutoharjo.desa.id",
        password_hash: superAdminPassword,
        role: "SUPERADMIN",
        created_at: new Date().toISOString(),
      },
      {
        id: "usr-admin",
        name: "Admin Pengelola UMKM",
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
    return JSON.parse(raw);
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

  // 5. UMKMS Queries
  if (/FROM umkms/i.test(q)) {
    let filtered = [...data.umkms];

    // Filter search, category, dusun
    if (/WHERE u\.slug =/i.test(q) || /WHERE slug =/i.test(q)) {
      const slugVal = values[0];
      filtered = filtered.filter((u) => u.slug === slugVal);
    } else if (/WHERE id =/i.test(q) || /WHERE u\.id =/i.test(q)) {
      const idVal = values[0];
      filtered = filtered.filter((u) => u.id === idVal);
    } else {
      // Filter is_verified
      if (/u\.is_verified = TRUE/i.test(q) || /is_verified = TRUE/i.test(q)) {
        filtered = filtered.filter((u) => u.is_verified === true);
      } else if (/u\.is_verified = FALSE/i.test(q) || /is_verified = FALSE/i.test(q)) {
        filtered = filtered.filter((u) => u.is_verified === false);
      }
    }

    if (/SELECT COUNT/i.test(q)) {
      return [{ total: filtered.length, count: filtered.length }];
    }

    // Attach category and formatting
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
      const target = data.umkms.find((u) => u.id === idVal);
      if (target) {
        target.is_verified = true;
        target.updated_at = new Date().toISOString();
        saveData(data);
        return [target];
      }
      return [];
    }

    if (/WHERE slug =/i.test(q)) {
      const slugVal = values[values.length - 1];
      const target = data.umkms.find((u) => u.slug === slugVal);
      if (target) {
        const [
          name, owner_name, description, address, dusun, operational_hours,
          whatsapp_number, maps_url, instagram_url, image_url, category_id, is_verified
        ] = values;

        if (name) target.name = name;
        if (owner_name) target.owner_name = owner_name;
        if (description) target.description = description;
        if (address) target.address = address;
        if (dusun) target.dusun = dusun;
        target.operational_hours = operational_hours || target.operational_hours;
        if (whatsapp_number) target.whatsapp_number = whatsapp_number;
        target.maps_url = maps_url || target.maps_url;
        target.instagram_url = instagram_url || target.instagram_url;
        if (image_url) target.image_url = image_url;
        if (category_id) target.category_id = category_id;
        if (is_verified !== null && is_verified !== undefined) target.is_verified = is_verified;
        target.updated_at = new Date().toISOString();
        saveData(data);
        return [target];
      }
      return [];
    }
  }

  if (/DELETE FROM umkms/i.test(q)) {
    const val = values[0];
    const initialLen = data.umkms.length;
    data.umkms = data.umkms.filter((u) => u.slug !== val && u.id !== val);
    data.products = data.products.filter((p) => p.umkm_id !== val);
    saveData(data);
    return [{ success: data.umkms.length < initialLen }];
  }

  // 6. PRODUCTS Queries
  if (/FROM products/i.test(q)) {
    const umkmIdVal = values[0];
    let prods = [...data.products];

    if (/WHERE umkm_id =/i.test(q)) {
      prods = prods.filter((p) => p.umkm_id === umkmIdVal);
    } else if (/WHERE id =/i.test(q)) {
      prods = prods.filter((p) => p.id === umkmIdVal);
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
    data.products = data.products.filter((p) => p.id !== idVal);
    saveData(data);
    return [{ success: true }];
  }

  return [];
}

module.exports = { executeLocalSql, loadData, saveData };
