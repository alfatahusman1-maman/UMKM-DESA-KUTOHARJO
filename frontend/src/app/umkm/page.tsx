import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UmkmCard from "@/components/UmkmCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { fetchCategories, fetchSiteSettings, fetchUmkms } from "@/lib/api";

interface PageProps {
  searchParams: {
    search?: string;
    category?: string;
    dusun?: string;
    minPrice?: string;
    maxPrice?: string;
    priceRange?: string;
    page?: string;
  };
}

export default async function DaftarUmkmPage({ searchParams }: PageProps) {
  const page = Math.max(1, Number(searchParams.page ?? 1));

  let minPrice = searchParams.minPrice;
  let maxPrice = searchParams.maxPrice;

  // Preset price range parser
  if (searchParams.priceRange) {
    if (searchParams.priceRange === "under50k") {
      minPrice = "0";
      maxPrice = "50000";
    } else if (searchParams.priceRange === "50k-100k") {
      minPrice = "50000";
      maxPrice = "100000";
    } else if (searchParams.priceRange === "100k-500k") {
      minPrice = "100000";
      maxPrice = "500000";
    } else if (searchParams.priceRange === "above500k") {
      minPrice = "500000";
      maxPrice = "";
    }
  }

  const [categories, umkmsRes, settings] = await Promise.all([
    fetchCategories(),
    fetchUmkms({
      search: searchParams.search,
      category: searchParams.category,
      dusun: searchParams.dusun,
      minPrice,
      maxPrice,
      page,
      limit: 6,
    }),
    fetchSiteSettings(),
  ]);

  const items = Array.isArray(umkmsRes.data) ? umkmsRes.data : [];
  const meta = umkmsRes.meta || { total: items.length, totalPages: 1, page: 1 };

  const navbarTitle = settings.navbar_title || "Portal UMKM Kutoharjo";
  const siteLogo = settings.site_logo || undefined;
  const footerBio = settings.footer_bio || undefined;
  const footerCopyright = settings.footer_copyright || undefined;

  const PRICE_OPTIONS = [
    { label: "Semua Harga", value: "" },
    { label: "< Rp 50.000", value: "under50k" },
    { label: "Rp 50rb - Rp 100rb", value: "50k-100k" },
    { label: "Rp 100rb - Rp 500rb", value: "100k-500k" },
    { label: "> Rp 500.000", value: "above500k" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar title={navbarTitle} logo={siteLogo} />

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 pb-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Katalog UMKM Desa</h1>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan <span className="font-semibold text-slate-900">{meta.total}</span> UMKM terverifikasi di Desa Kutoharjo.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="lg:w-72">
              <SearchBar />
            </div>
            <div className="flex-1">
              <CategoryFilter categories={categories} />
            </div>
          </div>

          {/* Fitur 4: Price Range Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200/60">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">payments</span>
              <span>Rentang Harga:</span>
            </span>
            {PRICE_OPTIONS.map((opt) => {
              const isActive = (searchParams.priceRange || "") === opt.value;
              const queryObj: any = {
                ...(searchParams.search ? { search: searchParams.search } : {}),
                ...(searchParams.category ? { category: searchParams.category } : {}),
                ...(searchParams.dusun ? { dusun: searchParams.dusun } : {}),
                page: "1",
              };
              if (opt.value) queryObj.priceRange = opt.value;
              const queryString = new URLSearchParams(queryObj).toString();

              return (
                <Link
                  key={opt.value}
                  href={`/umkm${queryString ? `?${queryString}` : ""}`}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((umkm: any) => (
                <UmkmCard key={umkm.id} umkm={umkm} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-lg p-12 text-center text-xs text-slate-500 space-y-2">
              <span className="material-symbols-outlined text-4xl text-slate-300 block">search_off</span>
              <p className="font-semibold text-slate-700">Tidak ada UMKM yang sesuai dengan filter harga / kata kunci ini</p>
              <p>Coba pilih rentang harga lain atau hapus filter pencarian.</p>
            </div>
          )}

          {/* Fitur 4: Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => {
                const params = new URLSearchParams({
                  ...(searchParams.search ? { search: searchParams.search } : {}),
                  ...(searchParams.category ? { category: searchParams.category } : {}),
                  ...(searchParams.priceRange ? { priceRange: searchParams.priceRange } : {}),
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
