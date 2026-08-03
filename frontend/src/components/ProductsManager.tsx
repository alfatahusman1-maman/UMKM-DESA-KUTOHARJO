"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function ProductsManager({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
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
          title: formData.title,
          price: parseInt(formData.price, 10),
          description: formData.description,
          imageUrl: formData.imageUrl,
        }),
      });

      if (res.ok) {
        setFormData({ title: "", price: "", description: "", imageUrl: "" });
        setIsAdding(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert("Gagal menambahkan produk: " + (data.error || ""));
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md text-primary text-xl">Daftar Produk ({initialProducts.length})</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-xs bg-primary text-white px-md py-sm rounded-lg font-label-md hover:shadow-lg transition-all"
        >
          {isAdding ? "Batal" : <><Plus size={18} /> Tambah Produk</>}
        </button>
      </div>

      {isAdding && (
        <div className="neumorphic-flat p-xl rounded-2xl border border-white/50 bg-white/30 animate-in slide-in-from-top-4">
          <h3 className="font-headline-md text-primary mb-md">Tambah Produk Baru</h3>
          <form onSubmit={handleAddSubmit} className="space-y-md">
            <div className="grid md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-on-surface">URL Gambar (Gunakan link gambar valid)</label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-on-surface">Deskripsi Singkat</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loadingId === "add"}
                className="inline-flex items-center gap-xs bg-secondary text-white px-lg py-sm rounded-lg font-label-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loadingId === "add" ? <Loader2 size={18} className="animate-spin" /> : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      )}

      {initialProducts.length === 0 ? (
        <div className="text-center py-3xl text-on-surface-variant font-body-md bg-surface-variant/30 rounded-2xl border border-outline-variant">
          Belum ada produk yang ditambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {initialProducts.map((p) => (
            <div key={p.id} className="neumorphic-flat rounded-xl overflow-hidden border border-white/50 flex flex-col">
              <div className="relative h-40 w-full bg-surface-variant/50 flex items-center justify-center">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                ) : (
                  <ImageIcon className="text-outline" size={40} />
                )}
              </div>
              <div className="p-md flex-1 flex flex-col">
                <h4 className="font-headline-md text-primary line-clamp-1">{p.title}</h4>
                <p className="text-secondary font-label-md mb-xs">{formatRupiah(p.price)}</p>
                <p className="font-body-sm text-on-surface-variant line-clamp-2 flex-1">{p.description}</p>
                
                <div className="mt-md flex justify-end">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={loadingId === p.id}
                    className="inline-flex items-center gap-xs text-red-500 hover:bg-red-50 px-sm py-xs rounded transition-colors disabled:opacity-50 font-label-sm"
                  >
                    {loadingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
