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
    umkms: [
      {
        id: "umkm-1",
        user_id: "usr-admin-kutoharjo",
        category_id: "cat-1",
        name: "Bandeng Presto & Cabut Duri Mbak Sum",
        slug: "bandeng-presto-mbak-sum",
        owner_name: "Mbak Sumiati",
        description: "Produk unggulan olahan ikan bandeng presto dan cabut duri resep tradisional khas Kaliwungu, Desa Kutoharjo. Gurih, daging lembut, bebas duri, tanpa bau tanah, dan dikemas higienis dengan sistem vakum.",
        address: "Jl. Raya Kutoharjo No. 42, RT 02 / RW 03",
        dusun: "Kutoharjo",
        operational_hours: "08:00 - 20:00 WIB",
        whatsapp_number: "6281234567891",
        maps_url: "https://maps.google.com/?q=-6.9535,110.2642",
        instagram_url: "https://instagram.com/bandeng_mbaksum",
        image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        is_verified: true,
        certifications: ["Halal MUI", "P-IRT", "Unggulan Desa"],
        rating: "4.90",
        review_count: 12,
        created_at: "2026-08-04T10:00:00.000Z",
        updated_at: "2026-08-04T10:00:00.000Z",
      },
      {
        id: "umkm-2",
        user_id: "usr-admin-kutoharjo",
        category_id: "cat-1",
        name: "Kerupuk Rambak Sapi Berkah Barokah",
        slug: "rambak-sapi-berkah-barokah",
        owner_name: "H. Ahmad Rofiq",
        description: "Produsen kerupuk rambak kulit sapi asli khas Kutoharjo Kaliwungu. Gurih, renyah, mengembang sempurna, dan diproses secara higienis tanpa bahan pengawet sintesis.",
        address: "Dukuh Gambiran RT 04 / RW 01, Desa Kutoharjo",
        dusun: "Gambiran",
        operational_hours: "07:00 - 17:00 WIB",
        whatsapp_number: "6285712345678",
        maps_url: "https://maps.google.com/?q=-6.9540,110.2650",
        instagram_url: "https://instagram.com/rambak_berkah_kutoharjo",
        image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        is_verified: true,
        certifications: ["Halal MUI", "P-IRT"],
        rating: "4.80",
        review_count: 15,
        created_at: "2026-08-04T10:05:00.000Z",
        updated_at: "2026-08-04T10:05:00.000Z",
      },
      {
        id: "umkm-3",
        user_id: "usr-admin-kutoharjo",
        category_id: "cat-1",
        name: "Warung Soto & Garang Asem Pak Mul",
        slug: "warung-soto-garang-asem-pak-mul",
        owner_name: "Pak Mulyono",
        description: "Kuliner olahan ayam kampung legendaris Desa Kutoharjo. Menyajikan soto bening rempah yang segar dan garang asem bungkus daun pisang cita rasa asam gurih pedas alami.",
        address: "Jl. Pangeran Jumeneng No. 15, Dukuh Krajan",
        dusun: "Krajan",
        operational_hours: "06:30 - 16:00 WIB",
        whatsapp_number: "6281398765432",
        maps_url: "https://maps.google.com/?q=-6.9528,110.2635",
        instagram_url: "https://instagram.com/soto_pakmul_kutoharjo",
        image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        is_verified: true,
        certifications: ["Halal MUI", "Kuliner Khas Desa"],
        rating: "4.85",
        review_count: 20,
        created_at: "2026-08-04T10:10:00.000Z",
        updated_at: "2026-08-04T10:10:00.000Z",
      },
      {
        id: "umkm-4",
        user_id: "usr-admin-kutoharjo",
        category_id: "cat-2",
        name: "Batik Tulis & Cap Kutoharjo Indah",
        slug: "batik-kutoharjo-indah",
        owner_name: "Ibu Hj. Siti Nurjanah",
        description: "Sentra pengrajin kain batik khas pesisiran Kendal dengan motif khas flora-fauna dan kebudayaan Kaliwungu. Menggunakan bahan berkualitas dan pewarnaan tahan lama.",
        address: "Dukuh Kauman RT 01 / RW 02, Desa Kutoharjo",
        dusun: "Kauman",
        operational_hours: "08:00 - 17:00 WIB",
        whatsapp_number: "6282134567890",
        maps_url: "https://maps.google.com/?q=-6.9550,110.2645",
        instagram_url: "https://instagram.com/batik_kutoharjo",
        image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        is_verified: true,
        certifications: ["Warisan Budaya Desa", "Pewarna Alami"],
        rating: "4.95",
        review_count: 10,
        created_at: "2026-08-04T10:15:00.000Z",
        updated_at: "2026-08-04T10:15:00.000Z",
      },
      {
        id: "umkm-5",
        user_id: "usr-admin-kutoharjo",
        category_id: "cat-3",
        name: "Oemah Jahit & Konveksi Kutoharjo",
        slug: "oemah-jahit-konveksi-kutoharjo",
        owner_name: "Mas Hendra Prasetyo",
        description: "Jasa penjahit pakaian pria & wanita, pembuatan seragam sekolah, instansi, pakaian pesta, serta produksi kaos & jaket komunitas berpola presisi dan pengerjaan cepat.",
        address: "Jl. Kyai Asy'ari No. 8, Dukuh Sekopek, Desa Kutoharjo",
        dusun: "Sekopek",
        operational_hours: "08:30 - 20:00 WIB",
        whatsapp_number: "6289654321098",
        maps_url: "https://maps.google.com/?q=-6.9560,110.2660",
        instagram_url: "https://instagram.com/oemahjahit_kutoharjo",
        image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        is_verified: true,
        certifications: ["Jasa Terpercaya Desa"],
        rating: "4.75",
        review_count: 9,
        created_at: "2026-08-04T10:20:00.000Z",
        updated_at: "2026-08-04T10:20:00.000Z",
      },
    ],
    products: [
      {
        id: "prod-101",
        umkm_id: "umkm-1",
        title: "Bandeng Presto Vacuum (500gr)",
        price: 45000,
        description: "Ikan bandeng presto duri lunak dengan bumbu rempah pilihan, kemasan vakum tahan lama.",
        image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:00:00.000Z",
      },
      {
        id: "prod-102",
        umkm_id: "umkm-1",
        title: "Bandeng Cabut Duri Crispy",
        price: 40000,
        description: "Daging bandeng murni bebas duri dengan balutan tepung bumbu krispi gurih.",
        image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:01:00.000Z",
      },
      {
        id: "prod-103",
        umkm_id: "umkm-1",
        title: "Otak-Otak Bandeng Super",
        price: 38000,
        description: "Olahan daging bandeng cincang dengan kelapa parut dan rempah-rempah khas Kutoharjo.",
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:02:00.000Z",
      },
      {
        id: "prod-201",
        umkm_id: "umkm-2",
        title: "Kerupuk Rambak Sapi Kemasan 250gr",
        price: 25000,
        description: "Rambak kulit sapi goreng renyah dan gurih, pas untuk cemilan maupun lauk makan.",
        image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:05:00.000Z",
      },
      {
        id: "prod-202",
        umkm_id: "umkm-2",
        title: "Rambak Kulit Sapi Premium 500gr",
        price: 48000,
        description: "Kemasan besar kerupuk rambak kulit sapi kualitas ekspor, renyah tanpa minyak berlebih.",
        image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:06:00.000Z",
      },
      {
        id: "prod-301",
        umkm_id: "umkm-3",
        title: "Soto Ayam Kampung Spesial",
        price: 15000,
        description: "Porsi soto ayam kampung dengan kuah bening rempah, suwiran ayam gurih, kecambah, dan koya.",
        image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:10:00.000Z",
      },
      {
        id: "prod-302",
        umkm_id: "umkm-3",
        title: "Garang Asem Ayam Kampung",
        price: 22000,
        description: "Garang asem segar dikukus dalam bungkus daun pisang dengan belimbing wuluh dan cabai rawit.",
        image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:11:00.000Z",
      },
      {
        id: "prod-401",
        umkm_id: "umkm-4",
        title: "Kain Batik Tulis Motif Kendal (2 Meter)",
        price: 250000,
        description: "Kain batik tulis halus buatan tangan dengan motif pesisir khas Kutoharjo Kendal.",
        image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:15:00.000Z",
      },
      {
        id: "prod-402",
        umkm_id: "umkm-4",
        title: "Kain Batik Cap Kombinasi",
        price: 120000,
        description: "Kain batik cap bahan primissima halus cocok untuk kemeja, blouse, maupun dress.",
        image_url: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:16:00.000Z",
      },
      {
        id: "prod-403",
        umkm_id: "umkm-4",
        title: "Kemeja Batik Pria Premium",
        price: 175000,
        description: "Kemeja batik pria lapis furing halus, jahitan rapi untuk acara formal maupun kerja.",
        image_url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:17:00.000Z",
      },
      {
        id: "prod-501",
        umkm_id: "umkm-5",
        title: "Jasa Jahit Kemeja / Blouse Custom",
        price: 60000,
        description: "Jasa jahit kemeja atau blouse sesuai ukuran badan, pengerjaan rapi dan tepat waktu.",
        image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:20:00.000Z",
      },
      {
        id: "prod-502",
        umkm_id: "umkm-5",
        title: "Jasa Jahit Gamis / Gaun Pesta",
        price: 110000,
        description: "Jasa jahit gaun pesta & gamis wanita berpola elegan, termasuk payet dan aksesoris.",
        image_url: "https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:21:00.000Z",
      },
      {
        id: "prod-503",
        umkm_id: "umkm-5",
        title: "Konveksi Kaos Sablon Custom",
        price: 45000,
        description: "Pembuatan kaos komunitas bahan Cotton Combed 30s lengkap sablon DTF/Plastisol.",
        image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        created_at: "2026-08-04T10:22:00.000Z",
      },
    ],
    reviews: [
      {
        id: "rev-0ed88f47df18",
        umkm_id: "umkm-1",
        name: "Budi Santoso",
        rating: 5,
        comment: "Bandeng presto Mbak Sum benar-benar gurih dan tidak berbau tanah. Duri lunak aman untuk anak-anak!",
        created_at: "2026-08-04T11:24:21.234Z",
      },
      {
        id: "rev-cf17c41adff5",
        umkm_id: "umkm-2",
        name: "Siti Rahmawati",
        rating: 5,
        comment: "Kerupuk rambak sapinya sangat renyah dan gurih alami. Cocok banget buat oleh-oleh khas Kutoharjo Kendal.",
        created_at: "2026-08-04T11:15:52.812Z",
      },
    ],
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
