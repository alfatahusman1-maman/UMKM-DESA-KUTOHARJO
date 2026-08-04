import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchUmkmBySlug, fetchSiteSettings } from "@/lib/api";
import UmkmDetailClient from "./UmkmDetailClient";

interface PageProps {
  params: { slug: string };
}

/**
 * Fitur 1: Dynamic OpenGraph SEO Metadata for WhatsApp & Social Media Preview
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const umkm = await fetchUmkmBySlug(params.slug);
  if (!umkm) {
    return {
      title: "UMKM Tidak Ditemukan - Portal UMKM Kutoharjo",
    };
  }

  const title = `${umkm.name} - UMKM Desa Kutoharjo`;
  const description = `${umkm.description || "Profil & Produk UMKM Desa Kutoharjo, Kendal."} Pemilik: ${umkm.ownerName}, Dusun ${umkm.dusun}.`;
  const imageUrl = umkm.imageUrl || "/og-default.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://umkm-kutoharjo.vercel.app/umkm/${umkm.slug}`,
      siteName: "Portal UMKM Desa Kutoharjo",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: umkm.name,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function DetailUmkmPage({ params }: PageProps) {
  const [umkm, settings] = await Promise.all([
    fetchUmkmBySlug(params.slug),
    fetchSiteSettings(),
  ]);

  if (!umkm) notFound();

  const navbarTitle = settings.navbar_title || settings.site_name || "Kutoharjo Hub";
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
            <span>Kembali ke Katalog UMKM</span>
          </Link>
        </section>

        <UmkmDetailClient umkm={umkm} settings={settings} />
      </div>

      <Footer title={navbarTitle} bio={footerBio} copyright={footerCopyright} />
    </div>
  );
}
