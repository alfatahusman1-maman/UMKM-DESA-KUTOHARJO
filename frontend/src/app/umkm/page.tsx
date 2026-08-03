import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UmkmCard from "@/components/UmkmCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { fetchCategories, fetchSiteSettings, fetchUmkms } from "@/lib/api";

interface PageProps {
  searchParams: { search?: string; category?: string; dusun?: string; page?: string };
}

export default async function DaftarUmkmPage({ searchParams }: PageProps) {
  const page = Math.max(1, Number(searchParams.page ?? 1));

  const [categories, umkmsRes, settings] = await Promise.all([
    fetchCategories(),
    fetchUmkms({
      search: searchParams.search,
      category: searchParams.category,
      dusun: searchParams.dusun,
      page,
      limit: 12,
    }),
    fetchSiteSettings(),
  ]);

  const items = Array.isArray(umkmsRes.data) ? umkmsRes.data : [];
  const meta = umkmsRes.meta || { total: items.length, totalPages: 1 };

  const navbarTitle = settings.navbar_title || "Kutoharjo Hub";
  const siteLogo = settings.site_logo || undefined;
  const footerBio = settings.footer_bio || undefined;
  const footerCopyright = settings.footer_copyright || undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar title={navbarTitle} logo={siteLogo} />

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Daftar UMKM Desa</h1>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan <span className="font-semibold text-slate-900">{meta.total}</span> UMKM siap mendukung ekonomi Desa Kutoharjo.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="md:w-80">
              <SearchBar />
            </div>
            <div className="flex-1">
              <CategoryFilter categories={categories} />
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((umkm: any) => (
                <UmkmCard key={umkm.id} umkm={umkm} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500 space-y-2">
              <span className="material-symbols-outlined text-4xl text-slate-300 block">search_off</span>
              <p className="font-semibold text-slate-700">Tidak ada UMKM yang cocok</p>
              <p>Coba kata kunci pencarian atau filter kategori lainnya.</p>
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => {
                const params = new URLSearchParams({
                  ...(searchParams.search ? { search: searchParams.search } : {}),
                  ...(searchParams.category ? { category: searchParams.category } : {}),
                  page: String(p),
                });
                return (
                  <Link
                    key={p}
                    href={`/umkm?${params.toString()}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-xs font-semibold transition-all ${
                      p === page
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Footer title={navbarTitle} bio={footerBio} copyright={footerCopyright} />
    </div>
  );
}
