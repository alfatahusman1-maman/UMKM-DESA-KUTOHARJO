import Link from "next/link";

interface FooterProps {
  title?: string;
  bio?: string;
  copyright?: string;
}

export default function Footer({
  title = "Kutoharjo Hub",
  bio = "Platform resmi percepatan ekonomi digital untuk seluruh UMKM di wilayah Desa Kutoharjo. Mari tumbuh bersama secara mandiri dan inovatif.",
  copyright,
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">storefront</span>
              <h4 className="font-bold text-white text-lg tracking-tight">{title}</h4>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {bio}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Bagikan">
                <span className="material-symbols-outlined text-[16px]">share</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Website">
                <span className="material-symbols-outlined text-[16px]">language</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Email">
                <span className="material-symbols-outlined text-[16px]">mail</span>
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Tautan Cepat</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">chevron_right</span> Beranda</Link></li>
              <li><Link href="/umkm" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">chevron_right</span> Daftar UMKM</Link></li>
              <li><Link href="/tentang" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">chevron_right</span> Tentang Kami</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">chevron_right</span> Kontak Kami</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Bantuan & Legal</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/syarat" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">gavel</span> Syarat &amp; Ketentuan</Link></li>
              <li><Link href="/privasi" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">shield</span> Kebijakan Privasi</Link></li>
              <li><Link href="/bantuan" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">help</span> Pusat Bantuan</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">admin_panel_settings</span> Portal Login Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            {copyright || `© ${new Date().getFullYear()} Pemerintah Desa Kutoharjo. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <span>Dikembangkan untuk Digitalisasi UMKM Desa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
