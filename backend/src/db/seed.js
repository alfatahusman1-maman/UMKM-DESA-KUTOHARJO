require("dotenv").config();
const { db, schema } = require("./index");
const { hashPassword } = require("../utils/password");

async function seed() {
  console.log("🌱 Starting Database Seeding...");

  const superadminPassword = await hashPassword("superadmin123");
  const adminPassword = await hashPassword("admin123");

  const seedUsers = [
    {
      email: "superadmin@kutoharjo.desa.id",
      password: superadminPassword,
      name: "Super Admin Desa Kutoharjo",
      role: "superadmin",
    },
    {
      email: "admin@kutoharjo.desa.id",
      password: adminPassword,
      name: "Admin UMKM Kutoharjo",
      role: "admin",
    },
  ];

  const seedCategories = [
    { name: "Kuliner & Olahan Makanan", slug: "kuliner", icon: "utensils" },
    { name: "Kerajinan & Kriya", slug: "kerajinan", icon: "palette" },
    { name: "Pertanian & Hasil Bumi", slug: "pertanian", icon: "leaf" },
    { name: "Jasa & Perdagangan", slug: "jasa", icon: "store" },
  ];

  const seedUmkms = [
    {
      name: "Bandeng Presto & Cabut Duri Mbak Sum",
      slug: "bandeng-presto-mbak-sum",
      ownerName: "Mbak Sumiati",
      categoryId: 1,
      description: "Produk unggulan olahan ikan bandeng presto dan cabut duri resep tradisional khas Kaliwungu, Desa Kutoharjo. Gurih, daging lembut, bebas duri, tanpa bau tanah, dan dikemas higienis dengan sistem vakum.",
      address: "Jl. Raya Kutoharjo No. 42, RT 02 / RW 03",
      dusun: "Kutoharjo",
      whatsappNumber: "6281234567891",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.9535,110.2642",
      instagramUrl: "https://instagram.com/bandeng_mbaksum",
      operationalHours: "08:00 - 20:00 WIB",
      isVerified: true,
      certifications: ["Halal MUI", "P-IRT", "Unggulan Desa"],
      latitude: "-6.9535000",
      longitude: "110.2642000",
      rating: "4.90",
      reviewCount: 12,
    },
    {
      name: "Kerupuk Rambak Sapi Berkah Barokah",
      slug: "rambak-sapi-berkah-barokah",
      ownerName: "H. Ahmad Rofiq",
      categoryId: 1,
      description: "Produsen kerupuk rambak kulit sapi asli khas Kutoharjo Kaliwungu. Gurih, renyah, mengembang sempurna, dan diproses secara higienis tanpa bahan pengawet sintesis.",
      address: "Dukuh Gambiran RT 04 / RW 01, Desa Kutoharjo",
      dusun: "Gambiran",
      whatsappNumber: "6285712345678",
      imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.9540,110.2650",
      instagramUrl: "https://instagram.com/rambak_berkah_kutoharjo",
      operationalHours: "07:00 - 17:00 WIB",
      isVerified: true,
      certifications: ["Halal MUI", "P-IRT"],
      latitude: "-6.9540000",
      longitude: "110.2650000",
      rating: "4.80",
      reviewCount: 15,
    },
    {
      name: "Warung Soto & Garang Asem Pak Mul",
      slug: "warung-soto-garang-asem-pak-mul",
      ownerName: "Pak Mulyono",
      categoryId: 1,
      description: "Kuliner olahan ayam kampung legendaris Desa Kutoharjo. Menyajikan soto bening rempah yang segar dan garang asem bungkus daun pisang cita rasa asam gurih pedas alami.",
      address: "Jl. Pangeran Jumeneng No. 15, Dukuh Krajan",
      dusun: "Krajan",
      whatsappNumber: "6281398765432",
      imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.9528,110.2635",
      instagramUrl: "https://instagram.com/soto_pakmul_kutoharjo",
      operationalHours: "06:30 - 16:00 WIB",
      isVerified: true,
      certifications: ["Halal MUI", "Kuliner Khas Desa"],
      latitude: "-6.9528000",
      longitude: "110.2635000",
      rating: "4.85",
      reviewCount: 20,
    },
    {
      name: "Batik Tulis & Cap Kutoharjo Indah",
      slug: "batik-kutoharjo-indah",
      ownerName: "Ibu Hj. Siti Nurjanah",
      categoryId: 2,
      description: "Sentra pengrajin kain batik khas pesisiran Kendal dengan motif khas flora-fauna dan kebudayaan Kaliwungu. Menggunakan bahan berkualitas dan pewarnaan tahan lama.",
      address: "Dukuh Kauman RT 01 / RW 02, Desa Kutoharjo",
      dusun: "Kauman",
      whatsappNumber: "6282134567890",
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.9550,110.2645",
      instagramUrl: "https://instagram.com/batik_kutoharjo",
      operationalHours: "08:00 - 17:00 WIB",
      isVerified: true,
      certifications: ["Warisan Budaya Desa", "Pewarna Alami"],
      latitude: "-6.9550000",
      longitude: "110.2645000",
      rating: "4.95",
      reviewCount: 10,
    },
    {
      name: "Oemah Jahit & Konveksi Kutoharjo",
      slug: "oemah-jahit-konveksi-kutoharjo",
      ownerName: "Mas Hendra Prasetyo",
      categoryId: 4,
      description: "Jasa penjahit pakaian pria & wanita, pembuatan seragam sekolah, instansi, pakaian pesta, serta produksi kaos & jaket komunitas berpola presisi dan pengerjaan cepat.",
      address: "Jl. Kyai Asy'ari No. 8, Dukuh Sekopek, Desa Kutoharjo",
      dusun: "Sekopek",
      whatsappNumber: "6289654321098",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.9560,110.2660",
      instagramUrl: "https://instagram.com/oemahjahit_kutoharjo",
      operationalHours: "08:30 - 20:00 WIB",
      isVerified: true,
      certifications: ["Jasa Terpercaya Desa"],
      latitude: "-6.9560000",
      longitude: "110.2660000",
      rating: "4.75",
      reviewCount: 9,
    },
  ];

  const seedProducts = [
    {
      umkmId: 1,
      title: "Bandeng Presto Vacuum (500gr)",
      description: "Ikan bandeng presto duri lunak dengan bumbu rempah pilihan",
      price: "45000.00",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    },
    {
      umkmId: 1,
      title: "Otak-Otak Bandeng Special",
      description: "Olahan daging bandeng rempah gurih khas Kutoharjo",
      price: "38000.00",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    },
    {
      umkmId: 2,
      title: "Kerupuk Rambak Sapi Kemasan 250gr",
      description: "Rambak kulit sapi goreng renyah dan gurih khas Kutoharjo",
      price: "25000.00",
      imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    },
    {
      umkmId: 3,
      title: "Soto Ayam Kampung Spesial",
      description: "Porsi soto ayam kampung dengan kuah bening rempah",
      price: "15000.00",
      imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    },
    {
      umkmId: 4,
      title: "Kain Batik Tulis Motif Kendal (2 Meter)",
      description: "Kain batik katun halus pewarna alami khas Desa Kutoharjo",
      price: "250000.00",
      imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    },
    {
      umkmId: 5,
      title: "Jasa Jahit Kemeja / Blouse Custom",
      description: "Jasa jahit kemeja atau blouse sesuai ukuran badan",
      price: "60000.00",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const seedReviews = [
    {
      umkmId: 1,
      name: "Budi Santoso",
      rating: 5,
      comment: "Bandengnya benar-benar gurih dan tidak berbau lumpur. Bebas duri jadi sangat aman untuk anak-anak!",
    },
    {
      umkmId: 1,
      name: "Siti Rahmawati",
      rating: 5,
      comment: "Pengiriman cepat dan bumbu presto meresap sampai ke dalam. Sangat direkomendasikan untuk oleh-oleh.",
    },
  ];

  if (!db.isMock && db.insert) {
    try {
      await db.insert(schema.users).values(seedUsers).onConflictDoNothing();
      await db.insert(schema.categories).values(seedCategories).onConflictDoNothing();
      await db.insert(schema.umkms).values(seedUmkms).onConflictDoNothing();
      await db.insert(schema.products).values(seedProducts).onConflictDoNothing();
      await db.insert(schema.reviews).values(seedReviews).onConflictDoNothing();
      console.log("✅ Seed database success!");
    } catch (err) {
      console.error("⚠️ Error seeding database:", err.message);
    }
  } else {
    console.log("✅ In-memory database seed initialized successfully!");
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
