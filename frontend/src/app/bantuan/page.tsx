import { HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BantuanPage() {
  const faqs = [
    {
      q: "Bagaimana cara mendaftarkan UMKM saya?",
      a: "Anda bisa mendaftar dengan mengklik tombol 'Masuk / Daftar' di pojok kanan atas, lalu pilih 'Daftar di sini'. Isi formulir yang disediakan dengan data usaha yang valid. Setelah itu, tim admin desa akan melakukan verifikasi."
    },
    {
      q: "Apakah pendaftaran ini dipungut biaya?",
      a: "Tidak. Pendaftaran dan penggunaan platform Kutoharjo UMKM Hub 100% GRATIS untuk seluruh warga Desa Kutoharjo."
    },
    {
      q: "Berapa lama proses verifikasi akun UMKM?",
      a: "Proses verifikasi biasanya memakan waktu 1-2 hari kerja. Admin desa akan mengecek kesesuaian data yang Anda berikan dengan data kependudukan desa."
    },
    {
      q: "Apakah saya bisa mengubah profil atau produk saya setelah mendaftar?",
      a: "Tentu bisa. Setelah akun Anda diverifikasi, Anda dapat login kapan saja untuk memperbarui foto produk, deskripsi, harga, maupun nomor kontak Anda melalui halaman Dashboard Merchant."
    },
    {
      q: "Bagaimana jika saya lupa password akun saya?",
      a: "Saat ini fitur pemulihan password otomatis sedang dalam pengembangan. Anda bisa langsung menghubungi Admin Desa melalui halaman Kontak atau WhatsApp untuk meminta reset password."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-12 bg-surface text-on-surface">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
          
          <div className="text-center mb-2xl">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-md">
              <HelpCircle size={32} />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Pusat Bantuan (FAQ)</h1>
            <p className="font-body-md text-on-surface-variant">
              Temukan jawaban untuk pertanyaan yang paling sering diajukan seputar Kutoharjo UMKM Hub.
            </p>
          </div>

          <div className="space-y-md">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group neumorphic-flat rounded-xl bg-surface open:bg-surface/80 border border-white/50 transition-all duration-300"
              >
                <summary className="flex items-center justify-between cursor-pointer p-lg font-headline-md text-primary font-semibold marker:content-none">
                  {faq.q}
                  <span className="transition-transform duration-300 group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-lg pb-lg font-body-md text-on-surface-variant leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-3xl neumorphic-pressed p-xl rounded-2xl text-center border border-white/30">
            <MessageSquare size={32} className="mx-auto text-secondary mb-md" />
            <h2 className="font-headline-md text-primary mb-xs">Masih butuh bantuan?</h2>
            <p className="font-body-sm text-on-surface-variant mb-lg">
              Jika pertanyaan Anda tidak ada di daftar ini, jangan ragu untuk menghubungi kami secara langsung.
            </p>
            <Link
              href="/kontak"
              className="inline-block bg-primary text-white font-label-md px-xl py-sm rounded-lg hover:shadow-lg transition-all"
            >
              Hubungi Admin
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
