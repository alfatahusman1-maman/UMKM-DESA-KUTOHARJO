import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SyaratPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-12 bg-surface text-on-surface">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="neumorphic-flat p-xl sm:p-3xl rounded-3xl border border-white/50">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-md">Syarat & Ketentuan Layanan</h1>
            <p className="font-body-sm text-on-surface-variant mb-xl">Terakhir diperbarui: 21 Juli 2026</p>

            <div className="prose prose-slate max-w-none space-y-md font-body-md text-on-surface">
              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">1. Pendahuluan</h2>
                <p>
                  Selamat datang di portal Kutoharjo UMKM Hub. Dengan mendaftar dan menggunakan layanan ini, Anda menyetujui untuk terikat dengan seluruh syarat dan ketentuan yang ditetapkan oleh Pemerintah Desa Kutoharjo.
                </p>
              </section>

              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">2. Pendaftaran UMKM</h2>
                <p>
                  Pelaku usaha yang berhak mendaftar di platform ini adalah warga yang memiliki usaha nyata dan berdomisili atau beroperasi di wilayah Desa Kutoharjo, Kecamatan Pati, Kabupaten Pati.
                </p>
                <ul className="list-disc pl-xl mt-sm space-y-xs">
                  <li>Data yang diberikan harus valid dan dapat dipertanggungjawabkan.</li>
                  <li>Admin Desa berhak menolak atau menghapus pendaftaran yang terindikasi penipuan.</li>
                  <li>Satu NIK/Identitas maksimal mendaftarkan 3 jenis usaha yang berbeda.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">3. Hak dan Kewajiban</h2>
                <p>
                  <strong>Hak Merchant:</strong> Mendapatkan fasilitas promosi digital, akses ke pelatihan UMKM desa, dan fitur etalase produk.
                </p>
                <p className="mt-sm">
                  <strong>Kewajiban Merchant:</strong> Menjaga kualitas produk, melayani pelanggan dengan etika yang baik, dan memperbarui ketersediaan produk/jasa secara berkala.
                </p>
              </section>

              <section>
                <h2 className="font-headline-md text-primary mt-lg mb-sm">4. Batasan Tanggung Jawab</h2>
                <p>
                  Pemerintah Desa Kutoharjo bertindak sebagai fasilitator platform promosi dan tidak bertanggung jawab atas kerugian finansial, sengketa jual beli, atau masalah pengiriman antara merchant dan pembeli. Transaksi sepenuhnya merupakan tanggung jawab pihak yang bertransaksi.
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
