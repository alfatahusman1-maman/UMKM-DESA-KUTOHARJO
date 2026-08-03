const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/superadmin/settings`, { cache: "no-store" });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch (err) {
    console.error("Failed to fetch site settings from backend:", err);
    return {};
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Failed to fetch categories from backend:", err);
    return [];
  }
}

export async function fetchUmkms(query: { search?: string; category?: string; dusun?: string; page?: number; limit?: number } = {}) {
  try {
    const params = new URLSearchParams();
    if (query.search) params.append("search", query.search);
    if (query.category) params.append("category", query.category);
    if (query.dusun) params.append("dusun", query.dusun);
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));

    const res = await fetch(`${BACKEND_URL}/api/umkm?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) return { data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } };
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Failed to fetch umkms from backend:", err);
    return { data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export async function fetchUmkmBySlug(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/umkm/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("Failed to fetch umkm by slug from backend:", err);
    return null;
  }
}

export async function fetchAdminStats(token?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/admin/stats`, { headers, cache: "no-store" });
    if (!res.ok) return { stats: { totalUmkm: 0, verifiedUmkm: 0, pendingUmkm: 0, totalUser: 0 }, recentPending: [] };
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch admin stats:", err);
    return { stats: { totalUmkm: 0, verifiedUmkm: 0, pendingUmkm: 0, totalUser: 0 }, recentPending: [] };
  }
}
