import bcrypt from "bcryptjs";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  icon_name?: string;
}

export interface ProductData {
  id: string;
  umkmId: string;
  umkm_id?: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  image_url?: string;
}

export interface UmkmData {
  id: string;
  userId?: string;
  categoryId: string;
  category_id?: string;
  name: string;
  slug: string;
  ownerName: string;
  owner_name?: string;
  description: string;
  address: string;
  dusun: string;
  operationalHours?: string;
  operational_hours?: string;
  whatsappNumber: string;
  whatsapp_number?: string;
  mapsUrl?: string | null;
  maps_url?: string | null;
  instagramUrl?: string | null;
  instagram_url?: string | null;
  imageUrl: string;
  image_url?: string;
  isVerified: boolean;
  is_verified?: boolean;
  category?: CategoryData;
  products?: ProductData[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}

// Global in-memory storage for Vercel Serverless environment
const globalStore = globalThis as unknown as {
  __categories?: CategoryData[];
  __umkms?: UmkmData[];
  __products?: ProductData[];
  __users?: UserData[];
};

if (!globalStore.__categories) {
  globalStore.__categories = [
    { id: "cat-1", name: "Kuliner", slug: "kuliner", iconName: "restaurant", icon_name: "restaurant" },
    { id: "cat-2", name: "Kerajinan", slug: "kerajinan", iconName: "palette", icon_name: "palette" },
    { id: "cat-3", name: "Jasa", slug: "jasa", iconName: "handyman", icon_name: "handyman" },
    { id: "cat-4", name: "Fashion", slug: "fashion", iconName: "checkroom", icon_name: "checkroom" },
    { id: "cat-5", name: "Pertanian & Peternakan", slug: "pertanian-peternakan", iconName: "agriculture", icon_name: "agriculture" },
  ];
}

if (!globalStore.__umkms) {
  globalStore.__umkms = [
    {
      id: "umkm-1",
      categoryId: "cat-1",
      category_id: "cat-1",
      name: "Kopi Bubuk Robusta Kutoharjo",
      slug: "kopi-bubuk-robusta-kutoharjo",
      ownerName: "Pak Maman",
      owner_name: "Pak Maman",
      description: "Kopi olahan khas Desa Kutoharjo dipetik dari kebun sendiri dan disangrai dengan cara tradisional untuk menjaga aroma cita rasa terbaik.",
      address: "Jl. Raya Kutoharjo No. 12",
      dusun: "Kutoharjo Tengah",
      operationalHours: "Senin - Sabtu (08.00 - 17.00 WIB)",
      operational_hours: "Senin - Sabtu (08.00 - 17.00 WIB)",
      whatsappNumber: "6281234567890",
      whatsapp_number: "6281234567890",
      mapsUrl: "https://maps.google.com/?q=-6.9,110.2",
      maps_url: "https://maps.google.com/?q=-6.9,110.2",
      instagramUrl: "https://instagram.com/kopikutoharjo",
      instagram_url: "https://instagram.com/kopikutoharjo",
      imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
      image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
      isVerified: true,
      is_verified: true,
    },
    {
      id: "umkm-2",
      categoryId: "cat-2",
      category_id: "cat-2",
      name: "Kerajinan Anom Kriya Batik",
      slug: "kerajinan-anom-kriya-batik",
      ownerName: "Ibu Nurhayati",
      owner_name: "Ibu Nurhayati",
      description: "Sentra kerajinan batik tulis bermotif lokal Kutoharjo. Melayani pemesanan kain batik custom untuk seragam kantor dan acara keluarga.",
      address: "RT 03 RW 02 Dusun Kutoharjo Barat",
      dusun: "Kutoharjo Barat",
      operationalHours: "Setiap Hari (09.00 - 20.00 WIB)",
      operational_hours: "Setiap Hari (09.00 - 20.00 WIB)",
      whatsappNumber: "6285712345678",
      whatsapp_number: "6285712345678",
      mapsUrl: "https://maps.google.com/?q=-6.91,110.21",
      maps_url: "https://maps.google.com/?q=-6.91,110.21",
      instagramUrl: "",
      instagram_url: "",
      imageUrl: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=800",
      image_url: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=800",
      isVerified: true,
      is_verified: true,
    },
  ];
}

if (!globalStore.__products) {
  globalStore.__products = [
    {
      id: "prod-1",
      umkmId: "umkm-1",
      umkm_id: "umkm-1",
      title: "Kopi Robusta Premium 250gr",
      price: 35000,
      description: "Biji kopi pilihan roasted medium dark.",
      imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
      image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
    },
    {
      id: "prod-2",
      umkmId: "umkm-2",
      umkm_id: "umkm-2",
      title: "Kain Batik Tulis Motif Kutoharjo",
      price: 250000,
      description: "Kain katun primissima 2x1.15 meter batik tulis halus.",
      imageUrl: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=500",
      image_url: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=500",
    },
  ];
}

if (!globalStore.__users) {
  globalStore.__users = [
    {
      id: "usr-superadmin",
      name: "Super Admin Desa",
      email: "superadmin@kutoharjo.desa.id",
      passwordHash: bcrypt.hashSync("superadmin123", 10),
      role: "SUPERADMIN",
    },
    {
      id: "usr-admin",
      name: "Admin Pengelola UMKM",
      email: "admin@kutoharjo.desa.id",
      passwordHash: bcrypt.hashSync("admin123", 10),
      role: "ADMIN",
    },
  ];
}

export function getCategoriesStore() {
  return globalStore.__categories || [];
}

export function getUmkmsStore(query: { search?: string; category?: string; dusun?: string } = {}) {
  let list = (globalStore.__umkms || []).map((umkm) => {
    const category = (globalStore.__categories || []).find((c) => c.id === umkm.categoryId || c.id === umkm.category_id);
    const products = (globalStore.__products || []).filter((p) => p.umkmId === umkm.id || p.umkm_id === umkm.id);
    return {
      ...umkm,
      category,
      products,
    };
  });

  if (query.search) {
    const q = query.search.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.ownerName.toLowerCase().includes(q) || u.description.toLowerCase().includes(q));
  }
  if (query.category) {
    list = list.filter((u) => u.category?.slug === query.category || u.categoryId === query.category);
  }
  if (query.dusun) {
    list = list.filter((u) => u.dusun.toLowerCase().includes(query.dusun!.toLowerCase()));
  }

  return list;
}

export function getUmkmBySlugStore(slug: string) {
  const umkm = (globalStore.__umkms || []).find((u) => u.slug === slug || u.id === slug);
  if (!umkm) return null;
  const category = (globalStore.__categories || []).find((c) => c.id === umkm.categoryId || c.id === umkm.category_id);
  const products = (globalStore.__products || []).filter((p) => p.umkmId === umkm.id || p.umkm_id === umkm.id);
  return {
    ...umkm,
    category,
    products,
  };
}

export function addUmkmStore(data: Partial<UmkmData>) {
  const id = `umkm-${Date.now()}`;
  const slug = (data.name || `umkm-${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const newUmkm: UmkmData = {
    id,
    slug,
    name: data.name || "UMKM Baru",
    ownerName: data.ownerName || data.owner_name || "Pemilik",
    owner_name: data.ownerName || data.owner_name || "Pemilik",
    description: data.description || "",
    address: data.address || "",
    dusun: data.dusun || "Kutoharjo",
    operationalHours: data.operationalHours || data.operational_hours || "08.00 - 17.00 WIB",
    operational_hours: data.operationalHours || data.operational_hours || "08.00 - 17.00 WIB",
    whatsappNumber: data.whatsappNumber || data.whatsapp_number || "",
    whatsapp_number: data.whatsappNumber || data.whatsapp_number || "",
    mapsUrl: data.mapsUrl || data.maps_url || "",
    maps_url: data.mapsUrl || data.maps_url || "",
    instagramUrl: data.instagramUrl || data.instagram_url || "",
    instagram_url: data.instagramUrl || data.instagram_url || "",
    imageUrl: data.imageUrl || data.image_url || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
    image_url: data.imageUrl || data.image_url || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
    categoryId: data.categoryId || data.category_id || "cat-1",
    category_id: data.categoryId || data.category_id || "cat-1",
    isVerified: true,
    is_verified: true,
  };

  globalStore.__umkms = [newUmkm, ...(globalStore.__umkms || [])];
  return getUmkmBySlugStore(newUmkm.slug);
}

export function updateUmkmStore(slug: string, data: Partial<UmkmData>) {
  const index = (globalStore.__umkms || []).findIndex((u) => u.slug === slug || u.id === slug);
  if (index === -1) return null;

  const existing = globalStore.__umkms![index];
  const updated: UmkmData = {
    ...existing,
    ...data,
    ownerName: data.ownerName || data.owner_name || existing.ownerName,
    owner_name: data.ownerName || data.owner_name || existing.owner_name,
    operationalHours: data.operationalHours || data.operational_hours || existing.operationalHours,
    operational_hours: data.operationalHours || data.operational_hours || existing.operational_hours,
    whatsappNumber: data.whatsappNumber || data.whatsapp_number || existing.whatsappNumber,
    whatsapp_number: data.whatsappNumber || data.whatsapp_number || existing.whatsapp_number,
    imageUrl: data.imageUrl || data.image_url || existing.imageUrl,
    image_url: data.imageUrl || data.image_url || existing.image_url,
    categoryId: data.categoryId || data.category_id || existing.categoryId,
    category_id: data.categoryId || data.category_id || existing.category_id,
  };

  globalStore.__umkms![index] = updated;
  return getUmkmBySlugStore(updated.slug);
}

export function deleteUmkmStore(slug: string) {
  const index = (globalStore.__umkms || []).findIndex((u) => u.slug === slug || u.id === slug);
  if (index === -1) return false;
  const umkmId = globalStore.__umkms![index].id;
  globalStore.__umkms = globalStore.__umkms!.filter((u) => u.id !== umkmId && u.slug !== slug);
  globalStore.__products = (globalStore.__products || []).filter((p) => p.umkmId !== umkmId && p.umkm_id !== umkmId);
  return true;
}

export function addProductStore(data: Partial<ProductData>) {
  const newProduct: ProductData = {
    id: `prod-${Date.now()}`,
    umkmId: data.umkmId || data.umkm_id || "",
    umkm_id: data.umkmId || data.umkm_id || "",
    title: data.title || "Produk Baru",
    price: Number(data.price) || 0,
    description: data.description || "",
    imageUrl: data.imageUrl || data.image_url || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
    image_url: data.imageUrl || data.image_url || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
  };

  globalStore.__products = [newProduct, ...(globalStore.__products || [])];
  return newProduct;
}

export function deleteProductStore(id: string) {
  const initialLength = (globalStore.__products || []).length;
  globalStore.__products = (globalStore.__products || []).filter((p) => p.id !== id);
  return (globalStore.__products || []).length < initialLength;
}

export function findUserByEmailStore(email: string) {
  return (globalStore.__users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());
}
