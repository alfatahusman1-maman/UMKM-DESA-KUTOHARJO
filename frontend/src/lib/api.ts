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
      site_name: "Kutoharjo UMKM Hub",
      hero_title: "Temukan & Dukung UMKM Lokal Desa Kutoharjo",
      hero_subtitle: "Direktori digital yang menghubungkan Anda langsung dengan pelaku usaha mikro, kecil, dan menengah di Desa Kutoharjo.",
    };
  }
}

export async function fetchCategories() {
  try {
    if (typeof window === "undefined" && (!process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL.includes("localhost"))) {
      return getCategoriesStore();
    }
    const res = await fetch(`${BACKEND_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json = await res.json();
    return json.data || getCategoriesStore();
  } catch (err) {
    return getCategoriesStore();
  }
}

export async function fetchUmkms(query: { search?: string; category?: string; dusun?: string; page?: number; limit?: number } = {}) {
  try {
    if (typeof window === "undefined" && (!process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL.includes("localhost"))) {
      const data = getUmkmsStore(query);
      return { data, meta: { page: 1, limit: 50, total: data.length, totalPages: 1 } };
    }
    const params = new URLSearchParams();
    if (query.search) params.append("search", query.search);
    if (query.category) params.append("category", query.category);
    if (query.dusun) params.append("dusun", query.dusun);
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));

    const res = await fetch(`${BACKEND_URL}/api/umkm?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json = await res.json();
    return json;
  } catch (err) {
    const data = getUmkmsStore(query);
    return { data, meta: { page: 1, limit: 50, total: data.length, totalPages: 1 } };
  }
}

export async function fetchUmkmBySlug(slug: string) {
  try {
    if (typeof window === "undefined" && (!process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL.includes("localhost"))) {
      return getUmkmBySlugStore(slug);
    }
    const res = await fetch(`${BACKEND_URL}/api/umkm/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json = await res.json();
    return json.data || getUmkmBySlugStore(slug);
  } catch (err) {
    return getUmkmBySlugStore(slug);
  }
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
