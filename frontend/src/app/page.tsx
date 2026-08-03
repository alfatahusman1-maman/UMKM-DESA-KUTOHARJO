import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UmkmCard from "@/components/UmkmCard";
import { fetchCategories, fetchSiteSettings, fetchUmkms } from "@/lib/api";

const CATEGORY_ICONS: Record<string, string> = {
  kuliner: "restaurant",
  kerajinan: "palette",
  jasa: "build",
  fashion: "checkroom",
  "pertanian-peternakan": "agriculture",
};

export default async function LandingPage() {
  const [umkmsRes, categories, settings] = await Promise.all([
    fetchUmkms({ limit: 4 }),
    fetchCategories(),
    fetchSiteSettings(),
  ]);

  const featured = umkmsRes.data || [];
  const totalUmkm = umkmsRes.meta?.total || featured.length;

  const dusunSet = new Set(featured.map((u: any) => u.dusun).filter(Boolean));
  const dusunCount = dusunSet.size || 3;

  const navbarTitle = settings.navbar_title || "Kutoharjo Hub";
  const siteLogo = settings.site_logo || undefined;
  const heroTitle = settings.hero_title || "Temukan & Dukung UMKM Lokal Desa Kutoharjo";
  const heroSubtitle = settings.hero_subtitle || "Direktori digital yang menghubungkan Anda langsung dengan pelaku usaha mikro, kecil, dan menengah di Desa Kutoharjo. Beli lokal, tumbuh bersama.";
  const aboutTitle = settings.about_title || "Kenapa Kutoharjo UMKM Hub?";
  const aboutText = settings.about_text || "Platform resmi Pemerintah Desa Kutoharjo untuk mendukung digitalisasi ekonomi lokal";

  const heroImage1 = settings.hero_image_1 || "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600";
  const heroImage2 = settings.hero_image_2 || "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600";
  const heroImage3 = settings.hero_image_3 || "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600";

  const footerBio = settings.footer_bio || undefined;
  const footerCopyright = settings.footer_copyright || undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      <Navbar title={navbarTitle} logo={siteLogo} />

      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-20">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 mb-6">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Platform Resmi Desa Kutoharjo</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: heroTitle }}
            />

            <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-lg leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/umkm"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-md text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
              >
                <span>Jelajahi UMKM</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-md text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs"
              >
                <span>Pelajari Lebih Lanjut</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-48 rounded-lg overflow-hidden border border-slate-200 shadow-md rotate-2 hover:rotate-0 transition-transform duration-500 bg-white p-1">
              <div className="relative w-full h-full rounded overflow-hidden">
                <Image
                  src={heroImage1}
                  alt="Foto Beranda 1"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>
            <div className="absolute top-20 left-6 w-56 h-44 rounded-lg overflow-hidden border border-slate-200 shadow-md -rotate-2 hover:rotate-0 transition-transform duration-500 bg-white p-1">
              <div className="relative w-full h-full rounded overflow-hidden">
                <Image
                  src={heroImage2}
                  alt="Foto Beranda 2"
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-10 w-60 h-44 rounded-lg overflow-hidden border border-slate-200 shadow-md rotate-1 hover:rotate-0 transition-transform duration-500 bg-white p-1">
              <div className="relative w-full h-full rounded overflow-hidden">
                <Image
                  src={heroImage3}
                  alt="Foto Beranda 3"
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "storefront", label: "UMKM Terverifikasi", value: totalUmkm, color: "text-slate-900" },
            { icon: "category", label: "Kategori Usaha", value: categories.length, color: "text-emerald-700" },
            { icon: "location_on", label: "Dusun Tercakup", value: dusunCount, color: "text-indigo-700" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ KATEGORI ══════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Kategori Usaha</h2>
            <p className="text-xs text-slate-500">
              Temukan UMKM berdasarkan jenis usaha di Desa Kutoharjo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Array.isArray(categories) ? categories : []).map((cat: any) => (
            <Link
              key={cat.slug}
              href={`/umkm?category=${cat.slug}`}
              className="bg-white border border-slate-200 rounded-lg p-4 text-center hover:border-slate-300 hover:shadow-xs transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 group-hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-slate-700 group-hover:text-slate-950 transition-colors text-[22px]">
                  {CATEGORY_ICONS[cat.slug] ?? "inventory_2"}
                </span>
              </div>
              <p className="font-semibold text-xs text-slate-900 group-hover:text-slate-700 transition-colors">
                {cat.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {cat._count?.umkms ?? 0} UMKM
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════ UMKM UNGGULAN ══════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">UMKM Unggulan</h2>
            <p className="text-xs text-slate-500">
              Pelaku usaha terbaru di Desa Kutoharjo
            </p>
          </div>
          <Link
            href="/umkm"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <span>Lihat Semua</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((umkm: any) => (
              <UmkmCard key={umkm.id} umkm={umkm as any} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
            Belum ada UMKM.
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700"
          >
            <span>Lihat Semua UMKM</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ══════════════ KENAPA KAMI ══════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="bg-slate-900 text-white rounded-lg p-8 md:p-12 border border-slate-800 shadow-md">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2 tracking-tight">
            {aboutTitle}
          </h2>
          <p className="text-xs text-slate-400 text-center mb-8 max-w-xl mx-auto leading-relaxed">
            {aboutText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "verified_user",
                title: "Terverifikasi Admin Desa",
                desc: "Setiap UMKM diverifikasi langsung oleh aparatur desa untuk menjamin keaslian dan kepercayaan.",
              },
              {
                icon: "trending_up",
                title: "Percepatan Ekonomi Digital",
                desc: "Membantu pelaku UMKM lokal menjangkau pasar lebih luas melalui platform digital yang mudah diakses.",
              },
              {
                icon: "diversity_3",
                title: "Dukungan Komunitas",
                desc: "Beli dari tetangga, dukung ekonomi desa. Setiap transaksi memperkuat rantai ekonomi lokal.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-5 hover:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-md bg-slate-700 border border-slate-600 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[22px]">{item.icon}</span>
                </div>
                <h3 className="font-semibold text-sm text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="bg-white border border-slate-200 rounded-lg p-8 md:p-10 text-center shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
            Punya Usaha di Desa Kutoharjo?
          </h2>
          <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
            Hubungi perangkat desa untuk mendaftarkan UMKM Anda secara gratis dan dapatkan visibilitas lebih luas melalui platform digital desa.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-md text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Hubungi Kami</span>
            <span className="material-symbols-outlined text-[16px]">mail</span>
          </Link>
        </div>
      </section>

      <Footer title={navbarTitle} bio={footerBio} copyright={footerCopyright} />
    </div>
  );
}
