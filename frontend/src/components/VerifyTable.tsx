"use client";

import { useState } from "react";
import { CheckCircle, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyTable({ initialUmkms }: { initialUmkms: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    if (!confirm("Yakin ingin memverifikasi UMKM ini?")) return;
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal memverifikasi");
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus UMKM ini? Data tidak dapat dikembalikan.")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal menghapus");
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoadingId(null);
  };

  if (initialUmkms.length === 0) {
    return (
      <div className="text-center py-3xl text-on-surface-variant font-body-md bg-surface-variant/30 rounded-2xl border border-outline-variant">
        Tidak ada UMKM yang menunggu verifikasi.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto neumorphic-flat rounded-2xl border border-white/50">
      <table className="w-full text-left font-body-md">
        <thead className="border-b border-white/50 bg-white/30">
          <tr className="text-primary font-label-md">
            <th className="p-md font-semibold">Nama Usaha</th>
            <th className="p-md font-semibold">Pemilik</th>
            <th className="p-md font-semibold">Kontak</th>
            <th className="p-md font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/30">
          {initialUmkms.map((umkm) => (
            <tr key={umkm.id} className="hover:bg-white/40 transition-colors">
              <td className="p-md">
                <p className="font-semibold text-on-surface">{umkm.name}</p>
                <p className="text-sm text-on-surface-variant">{umkm.category?.name}</p>
              </td>
              <td className="p-md text-on-surface">{umkm.ownerName}</td>
              <td className="p-md">
                <p className="text-sm text-on-surface">{umkm.whatsappNumber}</p>
                <p className="text-xs text-on-surface-variant">{umkm.dusun}</p>
              </td>
              <td className="p-md text-right space-x-sm">
                <button
                  onClick={() => handleVerify(umkm.id)}
                  disabled={loadingId === umkm.id}
                  className="inline-flex items-center gap-xs px-sm py-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                  title="Verifikasi"
                >
                  {loadingId === umkm.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  <span className="hidden sm:inline">Terima</span>
                </button>
                <button
                  onClick={() => handleDelete(umkm.id)}
                  disabled={loadingId === umkm.id}
                  className="inline-flex items-center gap-xs px-sm py-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                  title="Hapus / Tolak"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Tolak</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
