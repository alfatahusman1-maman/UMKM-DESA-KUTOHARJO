import { getCategoriesStore, getUmkmsStore, getUmkmBySlugStore } from "./store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/superadmin/settings`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json = await res.json();
    return json.data || {};
  } catch (err) {
    return {
      navbar_title: "Portal UMKM Korowelang",
      site_name: "Portal UMKM Desa Korowelang Kulon",
      hero_title: "Temukan & Dukung UMKM Lokal Korowelang Kulon",
      hero_subtitle: "Direktori digital yang menghubungkan Anda langsung dengan pelaku usaha mikro, kecil, dan menengah di Desa Korowelang Kulon.",
    };
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json = await res.json();
    return json.data || getCategoriesStore();
  } catch (err) {
    return getCategoriesStore();
  }
}

export interface FetchUmkmQuery {
  search?: string;
  category?: string;
  dusun?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  page?: number;
  limit?: number;
}

export async function fetchUmkms(query: FetchUmkmQuery = {}) {
  try {
    const params = new URLSearchParams();
    if (query.search) params.append("search", query.search);
    if (query.category) params.append("category", query.category);
    if (query.dusun) params.append("dusun", query.dusun);
    if (query.minPrice !== undefined && query.minPrice !== "") params.append("minPrice", String(query.minPrice));
    if (query.maxPrice !== undefined && query.maxPrice !== "") params.append("maxPrice", String(query.maxPrice));
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));

    const res = await fetch(`${BACKEND_URL}/api/umkm?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json = await res.json();
    return json;
  } catch (err) {
    const data = getUmkmsStore(query);
    return { data, meta: { page: 1, limit: 12, total: data.length, totalPages: 1 } };
  }
}

export async function fetchUmkmBySlug(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/umkm/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json = await res.json();
    return json.data || getUmkmBySlugStore(slug);
  } catch (err) {
    return getUmkmBySlugStore(slug);
  }
}

export async function submitReview(umkmId: string, reviewData: { name: string; rating: number; comment: string }) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/umkm/${encodeURIComponent(umkmId)}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || json.error || "Gagal mengirim ulasan");
    return json;
  } catch (err: any) {
    throw new Error(err.message || "Terjadi kesalahan saat mengirim ulasan");
  }
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BACKEND_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.url) {
    throw new Error(json.message || "Gagal mengupload gambar ke Cloudinary");
  }
  return json.url;
}

export function getExportUrl(type: "umkm" | "produk" | "feedback") {
  return `${BACKEND_URL}/api/export/${type}`;
}

export async function fetchAdminStats(token?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/admin/stats`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (err) {
    const list = getUmkmsStore();
    return {
      stats: {
        totalUmkm: list.length,
        verifiedUmkm: list.filter((u) => u.isVerified).length,
        pendingUmkm: list.filter((u) => !u.isVerified).length,
        totalUser: 2,
      },
      recentPending: [],
    };
  }
}
