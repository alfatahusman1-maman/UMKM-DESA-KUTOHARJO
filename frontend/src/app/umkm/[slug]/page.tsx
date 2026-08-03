import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import { fetchUmkmBySlug, fetchSiteSettings } from "@/lib/api";
import { buildWhatsAppLink, formatRupiah } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export default async function DetailUmkmPage({ params }: PageProps) {
  const [umkm, settings] = await Promise.all([
    fetchUmkmBySlug(params.slug),
    fetchSiteSettings(),
  ]);

  if (!umkm) notFound();

  const isKuliner = umkm.category?.name?.toLowerCase().includes("kuliner");
  const navbarTitle = settings.navbar_title || "Kutoharjo Hub";
  const siteLogo = settings.site_logo || undefined;
  const footerBio = settings.footer_bio || undefined;
  const footerCopyright = settings.footer_copyright || undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar title={navbarTitle} logo={siteLogo} />

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Daftar UMKM</span>
          </Link>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                <Image src={umkm.imageUrl} alt={umkm.name} fill className="object-cover" priority />
              </div>

              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {umkm.category && (
                  <span className="bg-slate-100 text-slate-900 border border-slate-200 px-3 py-1 rounded-md text-xs font-bold">
                    {umkm.category.name}
                  </span>
                )}
                {isKuliner && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>Sertifikasi Halal</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-1 tracking-tight">{umkm.name}</h1>
              <p className="text-xs text-slate-500 mb-6">
                Pemilik: <span className="font-semibold text-slate-700">{umkm.ownerName}</span> &middot; Dusun {umkm.dusun}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
                {umkm.description}
              </p>
            </div>

            {isKuliner && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 text-emerald-950 shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Sertifikasi Halal</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Produk dan olahan makanan/minuman UMKM ini telah tersertifikasi halal.
                  </p>
                </div>
              </div>
            )}

            {umkm.operationalHours && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px] text-slate-500">schedule</span>
                  <span>Jam Operasional</span>
                </div>
                <p className="text-xs text-slate-600 pl-5">{umkm.operationalHours}</p>
              </div>
            )}

            {/* SEKSI PETA LOKASI GOOGLE MAPS */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 tracking-tight">
                <span className="material-symbols-outlined text-slate-700 text-[18px]">location_on</span>
                <span>Peta Lokasi UMKM</span>
              </h3>
              <GoogleMapEmbed
                mapsUrl={umkm.mapsUrl}
                address={umkm.address}
                name={umkm.name}
                height="340px"
              />
            </div>

            {umkm.products && umkm.products.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-md font-bold text-slate-900 tracking-tight">Galeri Produk Usaha</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {umkm.products.map((product: any) => (
                    <div key={product.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                      <div className="relative h-32 w-full bg-slate-100">
                        <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-xs text-slate-900 line-clamp-1">{product.title}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-0.5">{formatRupiah(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar contact card */}
          <aside className="bg-white border border-slate-200 rounded-lg p-6 h-fit sticky top-20 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Hubungi UMKM Ini</h3>

            <a
              href={buildWhatsAppLink(umkm.whatsappNumber, umkm.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-md text-xs font-semibold shadow-2xs transition-colors w-full"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Hubungi via WhatsApp</span>
            </a>

            {umkm.mapsUrl && (
              <a
                href={umkm.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-md text-xs font-semibold shadow-2xs transition-colors w-full"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-500">map</span>
                <span>Buka di Google Maps</span>
              </a>
            )}

            {umkm.instagramUrl && (
              <a
                href={umkm.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-md text-xs font-semibold shadow-2xs transition-colors w-full"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-500">photo_camera</span>
                <span>Kunjungi Instagram</span>
              </a>
            )}

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">location_on</span>
                <span>{umkm.address}, Dusun {umkm.dusun}</span>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <Footer title={navbarTitle} bio={footerBio} copyright={footerCopyright} />
    </div>
  );
}
