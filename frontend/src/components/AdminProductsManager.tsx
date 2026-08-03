"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Package } from "lucide-react";

export default function AdminProductsManager({ initialProducts, umkms }: { initialProducts: any[], umkms: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    umkmId: umkms[0]?.id || "",
    title: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal menghapus produk");
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoadingId(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId("add");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price, 10),
        }),
      });

      if (res.ok) {
        setIsAdding(false);
        setFormData({ ...formData, title: "", price: "", description: "", imageUrl: "" });
        router.refresh();
      } else {
        const data = await res.json();
        alert("Gagal menambahkan produk: " + JSON.stringify(data.error));
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-center mb-md">
        <h2 className="font-headline-md text-primary text-xl">Daftar Produk ({initialProducts.length})</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          disabled={umkms.length === 0}
          className="inline-flex items-center gap-xs bg-primary text-white px-md py-sm rounded-lg font-label-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isAdding ? "Batal" : <><Plus size={18} /> Tambah Produk</>}
        </button>
      </div>

      {isAdding && (
        <div className="neumorphic-flat p-xl rounded-2xl border border-white/50 bg-white/30 animate-in slide-in-from-top-4 mb-lg">
          <h3 className="font-headline-md text-primary mb-md">Tambah Produk Baru</h3>
          <form onSubmit={handleAddSubmit} className="space-y-md">
            <div className="space-y-xs">
              <label className="font-label-md text-on-surface">Pilih UMKM Pemilik</label>
              <select
                required
                value={formData.umkmId} onChange={(e) => setFormData({ ...formData, umkmId: e.target.value })}
                className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
              >
                {umkms.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface">Nama Produk</label>
                <input
                  type="text" required
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface">Harga (Rp)</label>
                <input
                  type="number" required min={0}
                  value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div className="space-y-xs">
              <label className="font-label-md text-on-surface">URL Gambar Produk</label>
              <input
                type="url" required
                value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="space-y-xs">
              <label className="font-label-md text-on-surface">Deskripsi Singkat</label>
              <textarea
                required rows={2}
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="flex justify-end pt-sm">
              <button
                type="submit" disabled={loadingId === "add"}
                className="inline-flex items-center gap-xs bg-secondary text-white px-lg py-sm rounded-lg font-label-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loadingId === "add" ? <Loader2 size={18} className="animate-spin" /> : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {initialProducts.map((product) => (
          <div key={product.id} className="neumorphic-flat rounded-xl overflow-hidden border border-white/50 flex flex-col">
            <div className="h-32 w-full relative">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(product.id)}
                disabled={loadingId === product.id}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loadingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
            <div className="p-md flex flex-col flex-1">
              <h4 className="font-headline-sm text-primary line-clamp-1">{product.title}</h4>
              <p className="text-secondary font-label-sm mb-xs">Rp {product.price.toLocaleString("id-ID")}</p>
              <div className="mt-auto pt-sm border-t border-outline-variant">
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-label-sm truncate max-w-full inline-block">
                  {product.umkm?.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
