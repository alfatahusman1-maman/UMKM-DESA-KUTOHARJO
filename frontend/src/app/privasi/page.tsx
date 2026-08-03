import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivasiPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-12 bg-surface text-on-surface">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="neumorphic-flat p-xl sm:p-3xl rounded-3xl border border-white/50">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-md">Kebijakan Privasi</h1>
            <p className="font-body-sm text-on-surface-variant mb-xl">Terakhir diperbarui: 21 Juli 2026</p>

            <div className="prose prose-slate max-w-none space-y-md font-body-md text-on-surface">
              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">1. Informasi yang Kami Kumpulkan</h2>
                <p>
                  Kutoharjo UMKM Hub mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar sebagai UMKM, seperti:
                </p>
                <ul className="list-disc pl-xl mt-sm space-y-xs">
                  <li>Nama lengkap dan Identitas Kependudukan (jika diminta untuk verifikasi)</li>
                  <li>Alamat email dan nomor telepon yang bisa dihubungi</li>
                  <li>Alamat lengkap usaha dan titik lokasi (koordinat peta)</li>
                  <li>Foto produk dan deskripsi usaha</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">2. Penggunaan Informasi</h2>
                <p>
                  Informasi yang dikumpulkan digunakan secara eksklusif untuk keperluan platform, termasuk:
                </p>
                <ul className="list-disc pl-xl mt-sm space-y-xs">
                  <li>Menampilkan profil usaha Anda di direktori UMKM Desa Kutoharjo.</li>
                  <li>Menghubungi Anda terkait pembaruan layanan atau program pelatihan desa.</li>
                  <li>Menganalisis tren ekonomi dan memetakan potensi usaha desa untuk keperluan laporan statistik internal pemerintah desa.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">3. Keamanan Data</h2>
                <p>
                  Kami berkomitmen untuk melindungi data pribadi Anda. Seluruh kata sandi (password) disimpan dalam bentuk enkripsi yang tidak dapat dibaca (*hashed*). Kami tidak akan pernah menjual atau membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan eksplisit dari Anda, kecuali diwajibkan oleh hukum yang berlaku di Indonesia.
                </p>
              </section>

              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">4. Hak Pengguna</h2>
                <p>
                  Anda berhak sewaktu-waktu meminta untuk memperbarui, menyembunyikan sementara, atau menghapus permanen data usaha dan profil pribadi Anda dari platform ini dengan menghubungi Admin Desa.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
