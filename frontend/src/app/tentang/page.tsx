import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchSiteSettings } from "@/lib/api";

export default async function TentangPage() {
  const settings = await fetchSiteSettings();

  const navbarTitle = settings.navbar_title || "Kutoharjo Hub";
  const siteLogo = settings.site_logo || undefined;
  const aboutHeroTitle = settings.about_hero_title || "Membangun Ekosistem UMKM <span class=\"text-emerald-600\">Berdaya Saing</span>";
  const aboutHeroSubtitle = settings.about_hero_subtitle || "Kutoharjo UMKM Hub adalah portal resmi pemerintah Desa Kutoharjo untuk mendigitalisasi, mempromosikan, dan menghubungkan pelaku usaha mikro dengan pasar yang lebih luas.";
  const aboutImage = settings.about_image || "/images/tentang-desa.png";
  const aboutVisi = settings.about_visi || "Menjadikan Desa Kutoharjo sebagai pusat inovasi dan ekonomi kreatif yang mandiri, di mana setiap pelaku UMKM memiliki akses yang setara terhadap teknologi, pasar digital, dan kesempatan untuk berkembang hingga kancah nasional.";
  const aboutMisi1 = settings.about_misi_1 || "Mendigitalisasi pendataan seluruh UMKM aktif di desa.";
  const aboutMisi2 = settings.about_misi_2 || "Menyediakan platform promosi online terpusat yang mudah diakses.";
  const aboutMisi3 = settings.about_misi_3 || "Meningkatkan kepercayaan konsumen dengan verifikasi usaha resmi dari desa.";
  const aboutMisi4 = settings.about_misi_4 || "Memfasilitasi kolaborasi antar pedagang dan produsen lokal.";
  const footerBio = settings.footer_bio || undefined;
  const footerCopyright = settings.footer_copyright || undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar title={navbarTitle} logo={siteLogo} />
        <main className="pt-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <section className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 mb-4">
                  <span className="material-symbols-outlined text-[16px]">assured_workload</span>
                  <span>Inisiatif Digital Desa</span>
                </div>
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight"
                  dangerouslySetInnerHTML={{ __html: aboutHeroTitle }}
                />
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {aboutHeroSubtitle}
                </p>
                
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-2xs">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                    <span>Terverifikasi Desa</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-2xs">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">campaign</span>
                    <span>Dukungan Promosi</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-2xs">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">hub</span>
                    <span>Jaringan Bisnis</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="relative w-full aspect-video md:aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-white p-1 shadow-md">
                  <div className="relative w-full h-full rounded overflow-hidden">
                    <Image
                      src={aboutImage}
                      alt="Desa Kutoharjo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Visi Misi */}
            <section className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Visi & Misi</h2>
                <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1">
                  Langkah strategis kami untuk memajukan kesejahteraan masyarakat Kutoharjo melalui sektor UMKM.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-800 text-[18px]">visibility</span>
                    </div>
                    <span>Visi Utama</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {aboutVisi}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-800 text-[18px]">rocket_launch</span>
                    </div>
                    <span>Misi Strategis</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                      <span>{aboutMisi1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                      <span>{aboutMisi2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                      <span>{aboutMisi3}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
                      <span>{aboutMisi4}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer title={navbarTitle} bio={footerBio} copyright={footerCopyright} />
    </div>
  );
}
