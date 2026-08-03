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
  __settings?: Record<string, string>;
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

// Kosongkan data UMKM bawaan untuk testing manual
if (!globalStore.__umkms) {
  globalStore.__umkms = [];
}

// Kosongkan data Produk bawaan untuk testing manual
if (!globalStore.__products) {
  globalStore.__products = [];
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

if (!globalStore.__settings) {
  globalStore.__settings = {
    site_name: "Kutoharjo UMKM Hub",
    hero_title: "Temukan & Dukung UMKM Lokal Desa Kutoharjo",
    hero_subtitle: "Direktori digital yang menghubungkan Anda langsung dengan pelaku usaha mikro, kecil, dan menengah di Desa Kutoharjo.",
  };
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

export function verifyUmkmStore(id: string, isVerified: boolean) {
  const umkm = (globalStore.__umkms || []).find((u) => u.id === id || u.slug === id);
  if (umkm) {
    umkm.isVerified = isVerified;
    umkm.is_verified = isVerified;
    return true;
  }
  return false;
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

export function updateUserStore(idOrEmail: string, data: { name?: string; password?: string }) {
  const user = (globalStore.__users || []).find((u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase());
  if (!user) return null;
  if (data.name) user.name = data.name;
  if (data.password) user.passwordHash = bcrypt.hashSync(data.password, 10);
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function getSiteSettingsStore() {
  return globalStore.__settings || {};
}

export function updateSiteSettingsStore(data: Record<string, string>) {
  globalStore.__settings = { ...globalStore.__settings, ...data };
  return globalStore.__settings;
}

export function getAdminsStore() {
  return (globalStore.__users || []).filter((u) => u.role === "ADMIN");
}

export function createAdminStore(data: { name: string; email: string; password?: string }) {
  const newAdmin: UserData = {
    id: `usr-${Date.now()}`,
    name: data.name,
    email: data.email,
    passwordHash: bcrypt.hashSync(data.password || "admin123", 10),
    role: "ADMIN",
  };
  globalStore.__users = [newAdmin, ...(globalStore.__users || [])];
  return { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role };
}

export function deleteUserStore(id: string) {
  const initialLength = (globalStore.__users || []).length;
  globalStore.__users = (globalStore.__users || []).filter((u) => u.id !== id);
  return (globalStore.__users || []).length < initialLength;
}
