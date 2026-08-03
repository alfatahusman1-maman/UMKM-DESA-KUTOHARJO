import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchSiteSettings } from "@/lib/api";

export default async function KontakPage() {
  const settings = await fetchSiteSettings();

  const navbarTitle = settings.navbar_title || "Kutoharjo Hub";
  const siteLogo = settings.site_logo || undefined;
  
  const kontakTitle = settings.kontak_title || "Hubungi Kami";
  const kontakSubtitle = settings.kontak_subtitle || "Ada pertanyaan, masukan, atau kendala seputar layanan UMKM Hub? Tim desa Kutoharjo siap membantu Anda.";
  const kontakAddress = settings.kontak_address || "Jl. Raya Kutoharjo No. 1, Kecamatan Pati, Kabupaten Pati, Jawa Tengah 59111";
  const kontakPhone = settings.kontak_phone || "+62 812-3456-7890";
  const kontakEmail = settings.kontak_email || "pemdes@kutoharjo.desa.id";

  const footerBio = settings.footer_bio || undefined;
  const footerCopyright = settings.footer_copyright || undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar title={navbarTitle} logo={siteLogo} />
        <main className="pt-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{kontakTitle}</h1>
              <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
                {kontakSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Info Kontak Cards */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-800">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Alamat Kantor Desa</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {kontakAddress}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-800">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Telepon & WhatsApp</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {kontakPhone}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-2">
                  <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-800">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Email Resmi</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {kontakEmail}
                  </p>
                </div>
              </div>

              {/* Form Kirim Pesan */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-2xs">
                  <h2 className="text-md font-bold text-slate-900 mb-4 tracking-tight">Kirim Pesan ke Perangkat Desa</h2>
                  
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                          placeholder="Masukkan nama Anda"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Email atau WhatsApp</label>
                        <input
                          type="text"
                          className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                          placeholder="Kontak yang bisa dihubungi"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Subjek / Keperluan</label>
                      <select className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors">
                        <option value="">Pilih keperluan...</option>
                        <option value="pendaftaran">Tanya Pendaftaran UMKM</option>
                        <option value="bantuan">Bantuan Teknis Aplikasi</option>
                        <option value="kerjasama">Kerjasama & Kemitraan</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Pesan Anda</label>
                      <textarea
                        rows={4}
                        className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors resize-none"
                        placeholder="Tuliskan pesan Anda secara detail..."
                      ></textarea>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <span>Kirim Pesan Sekarang</span>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer title={navbarTitle} bio={footerBio} copyright={footerCopyright} />
    </div>
  );
}
