"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Globe, Home, Info, PhoneCall, LogIn } from "lucide-react";

export default function SiteSettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    site_logo: initialSettings.site_logo || "",
    navbar_title: initialSettings.navbar_title || "Kutoharjo Hub",
    footer_bio: initialSettings.footer_bio || "Platform resmi percepatan ekonomi digital untuk seluruh UMKM di wilayah Desa Kutoharjo. Mari tumbuh bersama secara mandiri dan inovatif.",
    footer_copyright: initialSettings.footer_copyright || "",
    
    hero_title: initialSettings.hero_title || "Temukan & Dukung UMKM Lokal Desa Kutoharjo",
    hero_subtitle: initialSettings.hero_subtitle || "Direktori digital yang menghubungkan Anda langsung dengan pelaku usaha mikro, kecil, dan menengah di Desa Kutoharjo. Beli lokal, tumbuh bersama.",
    about_title: initialSettings.about_title || "Kenapa Kutoharjo UMKM Hub?",
    about_text: initialSettings.about_text || "Platform resmi Pemerintah Desa Kutoharjo untuk mendukung digitalisasi ekonomi lokal",
    hero_image_1: initialSettings.hero_image_1 || "",
    hero_image_2: initialSettings.hero_image_2 || "",
    hero_image_3: initialSettings.hero_image_3 || "",

    login_image: initialSettings.login_image || "",
    login_banner_title: initialSettings.login_banner_title || "Kutoharjo UMKM Hub",
    login_banner_subtitle: initialSettings.login_banner_subtitle || "Mari bersama memajukan ekonomi lokal melalui digitalisasi UMKM Desa Kutoharjo.",
    login_form_title: initialSettings.login_form_title || "Selamat Datang",
    login_form_subtitle: initialSettings.login_form_subtitle || "Masuk ke akun merchant atau admin Anda.",

    about_hero_title: initialSettings.about_hero_title || "Membangun Ekosistem UMKM Berdaya Saing",
    about_hero_subtitle: initialSettings.about_hero_subtitle || "Kutoharjo UMKM Hub adalah portal resmi pemerintah Desa Kutoharjo untuk mendigitalisasi, mempromosikan, dan menghubungkan pelaku usaha mikro dengan pasar yang lebih luas.",
    about_image: initialSettings.about_image || "",
    about_visi: initialSettings.about_visi || "Menjadikan Desa Kutoharjo sebagai pusat inovasi dan ekonomi kreatif yang mandiri, di mana setiap pelaku UMKM memiliki akses yang setara terhadap teknologi, pasar digital, dan kesempatan untuk berkembang hingga kancah nasional.",
    about_misi_1: initialSettings.about_misi_1 || "Mendigitalisasi pendataan seluruh UMKM aktif di desa.",
    about_misi_2: initialSettings.about_misi_2 || "Menyediakan platform promosi online terpusat yang mudah diakses.",
    about_misi_3: initialSettings.about_misi_3 || "Meningkatkan kepercayaan konsumen dengan verifikasi usaha resmi dari desa.",
    about_misi_4: initialSettings.about_misi_4 || "Memfasilitasi kolaborasi antar pedagang dan produsen lokal.",

    kontak_title: initialSettings.kontak_title || "Hubungi Kami",
    kontak_subtitle: initialSettings.kontak_subtitle || "Ada pertanyaan, masukan, atau kendala seputar layanan UMKM Hub? Tim desa Kutoharjo siap membantu Anda.",
    kontak_address: initialSettings.kontak_address || "Jl. Raya Kutoharjo No. 1, Kecamatan Pati, Kabupaten Pati, Jawa Tengah 59111",
    kontak_phone: initialSettings.kontak_phone || "+62 812-3456-7890",
    kontak_email: initialSettings.kontak_email || "pemdes@kutoharjo.desa.id",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/superadmin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Semua pengaturan tampilan web berhasil disimpan!");
        router.refresh();
      } else {
        alert("Gagal memperbarui pengaturan");
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors";
  const textareaClass = "w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors resize-none";
  const buttonPrimary = "inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50";

  const tabs = [
    { id: "general", label: "Umum & Navigasi", icon: Globe },
    { id: "home", label: "Halaman Beranda", icon: Home },
    { id: "login", label: "Halaman Login", icon: LogIn },
    { id: "about", label: "Tentang Kami", icon: Info },
    { id: "contact", label: "Info Kontak", icon: PhoneCall },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 scrollbar-hide overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-slate-900 text-slate-900 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* TAB 1: GENERAL & NAVIGATION */}
        {activeTab === "general" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-1">Identitas Dasar & Navigasi</h3>
              <p className="text-xs text-slate-500 mb-4">Pengaturan logo, judul situs (teks header navbar), serta hak cipta di footer.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Logo Web / Navbar Header</label>
              <div className="flex items-center gap-4">
                {formData.site_logo ? (
                  <img src={formData.site_logo} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-slate-50" />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">No Logo</div>
                )}
                <input
                  type="file" accept="image/*"
                  onChange={(e) => handleFileChange(e, "site_logo")}
                  className="flex-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-slate-200 file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Judul Navbar / Teks Header Logo</label>
              <input
                type="text" required
                value={formData.navbar_title} onChange={(e) => setFormData({ ...formData, navbar_title: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Kutoharjo Hub"
              />
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-700">Deskripsi Singkat Footer (Bio)</label>
              <textarea
                required rows={3}
                value={formData.footer_bio} onChange={(e) => setFormData({ ...formData, footer_bio: e.target.value })}
                className={textareaClass}
                placeholder="Platform ekonomi digital..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Teks Hak Cipta (Copyright Footer) - Opsional</label>
              <input
                type="text"
                value={formData.footer_copyright} onChange={(e) => setFormData({ ...formData, footer_copyright: e.target.value })}
                className={inputClass}
                placeholder={`Contoh: © ${new Date().getFullYear()} Pemerintah Desa Kutoharjo. All rights reserved.`}
              />
            </div>
          </div>
        )}

        {/* TAB 2: LANDING PAGE (BERANDA) */}
        {activeTab === "home" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-1">Beranda Utama</h3>
              <p className="text-xs text-slate-500 mb-4">Ubah banner utama, sub-judul beranda, informasi profil singkat, dan foto-foto beranda.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Judul Banner Utama (Hero Title)</label>
              <input
                type="text" required
                value={formData.hero_title} onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Sub-judul Banner Utama (Hero Subtitle)</label>
              <textarea
                required rows={3}
                value={formData.hero_subtitle} onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                className={textareaClass}
              />
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-700">Judul Kenapa Kami</label>
              <input
                type="text" required
                value={formData.about_title} onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Teks Penjelasan Kenapa Kami</label>
              <textarea
                required rows={3}
                value={formData.about_text} onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                className={textareaClass}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Gambar Slide/Dekorasi Beranda (Maksimal 3 Foto)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image 1 */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Foto Beranda 1</label>
                  <div className="flex flex-col gap-2">
                    {formData.hero_image_1 && (
                      <img src={formData.hero_image_1} alt="Hero 1" className="w-full h-24 rounded object-cover border border-slate-200 bg-slate-50" />
                    )}
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => handleFileChange(e, "hero_image_1")}
                      className="text-xs text-slate-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Image 2 */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Foto Beranda 2</label>
                  <div className="flex flex-col gap-2">
                    {formData.hero_image_2 && (
                      <img src={formData.hero_image_2} alt="Hero 2" className="w-full h-24 rounded object-cover border border-slate-200 bg-slate-50" />
                    )}
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => handleFileChange(e, "hero_image_2")}
                      className="text-xs text-slate-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Image 3 */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Foto Beranda 3</label>
                  <div className="flex flex-col gap-2">
                    {formData.hero_image_3 && (
                      <img src={formData.hero_image_3} alt="Hero 3" className="w-full h-24 rounded object-cover border border-slate-200 bg-slate-50" />
                    )}
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => handleFileChange(e, "hero_image_3")}
                      className="text-xs text-slate-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOGIN PAGE */}
        {activeTab === "login" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-1">Halaman Login</h3>
              <p className="text-xs text-slate-500 mb-4">Pengaturan gambar hero login, judul banner, serta teks header form login.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Gambar Hero Login (Sisi Kiri)</label>
              <div className="flex items-center gap-4">
                {formData.login_image ? (
                  <img src={formData.login_image} alt="Hero Login" className="w-16 h-16 rounded object-cover border border-slate-200 bg-slate-50" />
                ) : (
                  <div className="w-16 h-16 rounded border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">Gambar Bawaan</div>
                )}
                <input
                  type="file" accept="image/*"
                  onChange={(e) => handleFileChange(e, "login_image")}
                  className="flex-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-slate-200 file:bg-slate-50 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500">Biarkan kosong jika ingin menggunakan gambar bawaan sistem.</p>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-700">Judul Banner Gambar Login</label>
              <input
                type="text" required
                value={formData.login_banner_title} onChange={(e) => setFormData({ ...formData, login_banner_title: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Kutoharjo UMKM Hub"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Sub-judul Banner Gambar Login</label>
              <textarea
                required rows={3}
                value={formData.login_banner_subtitle} onChange={(e) => setFormData({ ...formData, login_banner_subtitle: e.target.value })}
                className={textareaClass}
                placeholder="Mari bersama memajukan ekonomi lokal..."
              />
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700">Judul Header Form Login</label>
              <input
                type="text" required
                value={formData.login_form_title} onChange={(e) => setFormData({ ...formData, login_form_title: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Selamat Datang"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Sub-judul Header Form Login</label>
              <input
                type="text" required
                value={formData.login_form_subtitle} onChange={(e) => setFormData({ ...formData, login_form_subtitle: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Masuk ke akun merchant atau admin Anda."
              />
            </div>
          </div>
        )}

        {/* TAB 4: ABOUT US (TENTANG KAMI) */}
        {activeTab === "about" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-1">Halaman Tentang Kami</h3>
              <p className="text-xs text-slate-500 mb-4">Konfigurasi Visi, Misi Utama, dan foto desa/tentang kami.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Judul Hero Tentang Kami</label>
              <input
                type="text" required
                value={formData.about_hero_title} onChange={(e) => setFormData({ ...formData, about_hero_title: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Sub-judul Hero Tentang Kami</label>
              <textarea
                required rows={3}
                value={formData.about_hero_subtitle} onChange={(e) => setFormData({ ...formData, about_hero_subtitle: e.target.value })}
                className={textareaClass}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Foto Utama Tentang Kami (Desa/Produk)</label>
              <div className="flex items-center gap-4">
                {formData.about_image && (
                  <img src={formData.about_image} alt="Tentang" className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-50" />
                )}
                <input
                  type="file" accept="image/*"
                  onChange={(e) => handleFileChange(e, "about_image")}
                  className="flex-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-slate-200 file:bg-slate-50 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-700">Visi Desa / Portal</label>
              <textarea
                required rows={3}
                value={formData.about_visi} onChange={(e) => setFormData({ ...formData, about_visi: e.target.value })}
                className={textareaClass}
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Misi Utama (Poin 1 - 4)</h4>
              
              <div className="space-y-2">
                <input type="text" required value={formData.about_misi_1} onChange={(e) => setFormData({ ...formData, about_misi_1: e.target.value })} className={inputClass} placeholder="Misi ke-1" />
                <input type="text" required value={formData.about_misi_2} onChange={(e) => setFormData({ ...formData, about_misi_2: e.target.value })} className={inputClass} placeholder="Misi ke-2" />
                <input type="text" required value={formData.about_misi_3} onChange={(e) => setFormData({ ...formData, about_misi_3: e.target.value })} className={inputClass} placeholder="Misi ke-3" />
                <input type="text" required value={formData.about_misi_4} onChange={(e) => setFormData({ ...formData, about_misi_4: e.target.value })} className={inputClass} placeholder="Misi ke-4" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT INFO */}
        {activeTab === "contact" && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div>
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider mb-1">Halaman Kontak</h3>
              <p className="text-xs text-slate-500 mb-4">Pengaturan judul, email, telepon, dan alamat yang dirender pada halaman Hubungi Kami.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Judul Utama Halaman Kontak</label>
              <input
                type="text" required
                value={formData.kontak_title} onChange={(e) => setFormData({ ...formData, kontak_title: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Penjelasan Sub-judul Halaman Kontak</label>
              <textarea
                required rows={3}
                value={formData.kontak_subtitle} onChange={(e) => setFormData({ ...formData, kontak_subtitle: e.target.value })}
                className={textareaClass}
              />
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-700">Alamat Lengkap Kantor Desa</label>
              <textarea
                required rows={3}
                value={formData.kontak_address} onChange={(e) => setFormData({ ...formData, kontak_address: e.target.value })}
                className={textareaClass}
                placeholder="Jl. Raya Kutoharjo No. 1..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nomor Telepon & Jam Kerja</label>
              <input
                type="text" required
                value={formData.kontak_phone} onChange={(e) => setFormData({ ...formData, kontak_phone: e.target.value })}
                className={inputClass}
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Hubungi Kami</label>
              <input
                type="email" required
                value={formData.kontak_email} onChange={(e) => setFormData({ ...formData, kontak_email: e.target.value })}
                className={inputClass}
                placeholder="pemdes@kutoharjo.desa.id"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit" disabled={loading}
            className={buttonPrimary}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Simpan Semua Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
