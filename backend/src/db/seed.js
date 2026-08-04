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
      name: "Bandeng Cabut Duri Mbak Lis",
      slug: "bandeng-cabut-duri-mbak-lis",
      ownerName: "Lilis Suryani",
      categoryId: 1,
      description: "Produk olahan ikan bandeng presto dan cabut duri kualitas super dari Desa Kutoharjo. Gurih, bebas duri, dan higienis.",
      address: "RT 02 / RW 01, Desa Kutoharjo",
      dusun: "Krajan 1",
      whatsappNumber: "6281234567890",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.8975,110.1654",
      instagramUrl: "https://instagram.com/bandengmbaklis",
      operationalHours: "08.00 - 17.00 WIB",
      isVerified: true,
      certifications: ["Halal MUI", "P-IRT", "Unggulan Desa"],
      latitude: "-6.8975000",
      longitude: "110.1654000",
      rating: "4.80",
      reviewCount: 12,
    },
    {
      name: "Batik Kendalisada Kutoharjo",
      slug: "batik-kendalisada-kutoharjo",
      ownerName: "Hj. Mutmainah",
      categoryId: 2,
      description: "Sentra kerajinan batik tulis & cap khas Kendal dengan pewarna alam ramah lingkungan dan motif pesisir Kutoharjo.",
      address: "RT 05 / RW 02, Desa Kutoharjo",
      dusun: "Krajan 2",
      whatsappNumber: "6282198765432",
      imageUrl: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.8991,110.1682",
      instagramUrl: "https://instagram.com/batikkutoharjo",
      operationalHours: "09.00 - 16.00 WIB",
      isVerified: true,
      certifications: ["Unggulan Desa"],
      latitude: "-6.8991000",
      longitude: "110.1682000",
      rating: "4.90",
      reviewCount: 8,
    },
    {
      name: "Kerupuk Rambak Sapi Pak Supri",
      slug: "kerupuk-rambak-sapi-pak-supri",
      ownerName: "Supriyanto",
      categoryId: 1,
      description: "Kerupuk rambak kulit sapi asli renyah dan gurih khas olahan tradisional tanpa pengawet sintesis.",
      address: "RT 01 / RW 03, Desa Kutoharjo",
      dusun: "Nologaten",
      whatsappNumber: "6285712349999",
      imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      mapsUrl: "https://maps.google.com/?q=-6.8962,110.1630",
      instagramUrl: "",
      operationalHours: "07.00 - 18.00 WIB",
      isVerified: true,
      certifications: ["Halal MUI", "P-IRT", "BPOM"],
      latitude: "-6.8962000",
      longitude: "110.1630000",
      rating: "4.70",
      reviewCount: 15,
    },
  ];

  const seedProducts = [
    {
      umkmId: 1,
      title: "Bandeng Cabut Duri Crisp (500gr)",
      description: "Ikan bandeng presto kemasan vakum tanpa duri siap goreng",
      price: "45000.00",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    },
    {
      umkmId: 1,
      title: "Otak-Otak Bandeng Special",
      description: "Olahan daging bandeng rempah gurih khas Kutoharjo",
      price: "35000.00",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    },
    {
      umkmId: 2,
      title: "Kain Batik Tulis Motif Pesisir (2 Meter)",
      description: "Kain batik katun halus pewarna alami khas Desa Kutoharjo",
      price: "250000.00",
      imageUrl: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=800&q=80",
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
