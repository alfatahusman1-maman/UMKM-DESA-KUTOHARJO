"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Package, ChevronDown, ChevronUp, Edit2, MapPin, X, ExternalLink } from "lucide-react";

export default function UmkmManager({ initialUmkms, categories }: { initialUmkms: any[], categories: any[] }) {
  const router = useRouter();
  const [umkmsList, setUmkmsList] = useState<any[]>(initialUmkms || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedUmkm, setExpandedUmkm] = useState<string | null>(null);
  const [editingUmkm, setEditingUmkm] = useState<any | null>(null);

  useEffect(() => {
    setUmkmsList(initialUmkms || []);
  }, [initialUmkms]);

  // UMKM Form State (Tambah Baru)
  const [formData, setFormData] = useState({
    name: "", ownerName: "", description: "", address: "", dusun: "",
    operationalHours: "", whatsappNumber: "", mapsUrl: "", instagramUrl: "",
    imageUrl: "", categoryId: categories[0]?.id || "",
  });

  // Edit UMKM Form State
  const [editFormData, setEditFormData] = useState({
    name: "", ownerName: "", description: "", address: "", dusun: "",
    operationalHours: "", whatsappNumber: "", mapsUrl: "", instagramUrl: "",
    imageUrl: "", categoryId: categories[0]?.id || "",
  });

  // Product Form State
  const [productData, setProductData] = useState({
    title: "", price: "", description: "", imageUrl: "",
  });

  const handleDeleteUmkm = async (slug: string) => {
    if (!confirm("Yakin ingin menghapus UMKM ini? Semua produk di dalamnya juga akan terhapus.")) return;
    setLoadingId(slug);
    try {
      const res = await fetch(`/api/umkm/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setUmkmsList((prev) => prev.filter((u) => u.slug !== slug && u.id !== slug));
        router.refresh();
      } else {
        alert("Gagal menghapus UMKM");
      }
    } catch (e) { alert("Terjadi kesalahan"); }
    setLoadingId(null);
  };

  const handleUmkmImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData({ ...productData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  function extractErrorMessage(data: any): string {
    if (!data) return "Terjadi kesalahan";
    if (typeof data.error === "string") return data.error;
    if (data.error?.message) return data.error.message;
    if (data.error?.fieldErrors) {
      const fields = Object.entries(data.error.fieldErrors)
        .map(([key, errs]: [string, any]) => `${key}: ${Array.isArray(errs) ? errs.join(", ") : errs}`)
        .join("\n");
      if (fields) return `Periksa data input Anda:\n${fields}`;
    }
    return "Periksa data input Anda.";
  }

  const handleAddUmkm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId("add");
    try {
      const res = await fetch("/api/umkm", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: "admin" }),
      });
      if (res.ok) {
        setIsAdding(false);
        setFormData({
          name: "", ownerName: "", description: "", address: "", dusun: "",
          operationalHours: "", whatsappNumber: "", mapsUrl: "", instagramUrl: "",
          imageUrl: "", categoryId: categories[0]?.id || "",
        });
        router.refresh();
      } else {
        const data = await res.json();
        alert("Gagal menambahkan UMKM:\n" + extractErrorMessage(data));
      }
    } catch (e) { alert("Terjadi kesalahan"); }
    setLoadingId(null);
  };

  const handleStartEdit = (umkm: any) => {
    setEditingUmkm(umkm);
    setEditFormData({
      name: umkm.name || "",
      ownerName: umkm.ownerName || "",
      description: umkm.description || "",
      address: umkm.address || "",
      dusun: umkm.dusun || "",
      operationalHours: umkm.operationalHours || "",
      whatsappNumber: umkm.whatsappNumber || "",
      mapsUrl: umkm.mapsUrl || "",
      instagramUrl: umkm.instagramUrl || "",
      imageUrl: umkm.imageUrl || "",
      categoryId: umkm.categoryId || categories[0]?.id || "",
    });
  };

  const handleUpdateUmkm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUmkm) return;
    setLoadingId(`edit-${editingUmkm.slug}`);
    try {
      const res = await fetch(`/api/umkm/${editingUmkm.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setEditingUmkm(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert("Gagal memperbarui UMKM:\n" + extractErrorMessage(data));
      }
    } catch (e) {
      alert("Terjadi kesalahan saat memperbarui UMKM");
    }
    setLoadingId(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else alert("Gagal menghapus produk");
    } catch (e) { alert("Terjadi kesalahan"); }
    setLoadingId(null);
  };

  const handleAddProduct = async (e: React.FormEvent, umkmId: string) => {
    e.preventDefault();
    setLoadingId("add-product");
    try {
      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productData, price: parseInt(productData.price, 10), umkmId }),
      });
      if (res.ok) {
        setProductData({ title: "", price: "", description: "", imageUrl: "" });
        router.refresh();
      } else {
        const data = await res.json();
        alert("Gagal menambahkan produk:\n" + extractErrorMessage(data));
      }
    } catch (e) { alert("Terjadi kesalahan"); }
    setLoadingId(null);
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors";
  const selectClass = "w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors";
  const buttonPrimary = "inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50";
  const buttonSecondary = "inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold text-slate-900">Daftar UMKM ({umkmsList.length})</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingUmkm(null);
          }}
          className={isAdding ? buttonSecondary : buttonPrimary}
        >
          {isAdding ? "Batal" : <><Plus size={16} /> Tambah UMKM</>}
        </button>
      </div>

      {/* FORM TAMBAH UMKM */}
      {isAdding && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="text-md font-semibold text-slate-900 mb-4">Form Tambah UMKM Baru</h3>
          <form onSubmit={handleAddUmkm} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama UMKM</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Contoh: Kopi Bubuk Kutoharjo" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Pemilik</label>
                <input type="text" required value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} className={inputClass} placeholder="Nama Pemilik" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Kategori</label>
                <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className={selectClass}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp (Format: 628...)</label>
                <input type="text" required minLength={8} value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} className={inputClass} placeholder="628xxxxxxxxxx" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Alamat Lengkap</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="Alamat lengkap UMKM" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Dusun</label>
                <input type="text" required value={formData.dusun} onChange={(e) => setFormData({ ...formData, dusun: e.target.value })} className={inputClass} placeholder="Contoh: Kutoharjo Tengah" />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin size={14} className="text-slate-500" />
                  <span>Link URL Google Maps (Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/?q=..."
                  value={formData.mapsUrl || ""}
                  onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Jam Operasional (Opsional)</label>
                <input type="text" placeholder="misal: Senin - Sabtu (08.00 - 17.00 WIB)" value={formData.operationalHours || ""} onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Gambar (Logo/Sampul)</label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-50" />
                  )}
                  <input
                    type="file" accept="image/*" required
                    onChange={(e) => handleUmkmImageChange(e, false)}
                    className="flex-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-slate-200 file:text-xs file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Deskripsi Usaha</label>
              <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} resize-none`} placeholder="Jelaskan produk atau jasa yang ditawarkan oleh UMKM..." />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={loadingId === "add"} className={buttonPrimary}>
                {loadingId === "add" ? <Loader2 size={16} className="animate-spin" /> : "Simpan UMKM"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FORM EDIT UMKM MODAL */}
      {editingUmkm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full border border-slate-200 shadow-xl space-y-4 animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-md font-semibold text-slate-900">Edit Data UMKM: {editingUmkm.name}</h3>
              <button onClick={() => setEditingUmkm(null)} className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateUmkm} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nama UMKM</label>
                  <input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nama Pemilik</label>
                  <input type="text" required value={editFormData.ownerName} onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Kategori</label>
                  <select required value={editFormData.categoryId} onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })} className={selectClass}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp</label>
                  <input type="text" required minLength={8} value={editFormData.whatsappNumber} onChange={(e) => setEditFormData({ ...editFormData, whatsappNumber: e.target.value })} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Alamat Lengkap</label>
                  <input type="text" required value={editFormData.address} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Dusun</label>
                  <input type="text" required value={editFormData.dusun} onChange={(e) => setEditFormData({ ...editFormData, dusun: e.target.value })} className={inputClass} />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin size={14} className="text-slate-500" />
                    <span>Link URL Google Maps</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Link Google Maps"
                    value={editFormData.mapsUrl || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, mapsUrl: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Jam Operasional</label>
                  <input type="text" value={editFormData.operationalHours || ""} onChange={(e) => setEditFormData({ ...editFormData, operationalHours: e.target.value })} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Gambar UMKM</label>
                  <div className="flex items-center gap-4">
                    {editFormData.imageUrl && (
                      <img src={editFormData.imageUrl} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-200 bg-slate-50" />
                    )}
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => handleUmkmImageChange(e, true)}
                      className="flex-1 text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-slate-200 file:text-[11px] file:bg-slate-50 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Deskripsi Usaha</label>
                <textarea required rows={3} value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className={`${inputClass} resize-none`} />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setEditingUmkm(null)} className={buttonSecondary}>
                  Batal
                </button>
                <button type="submit" disabled={loadingId === `edit-${editingUmkm.slug}`} className={buttonPrimary}>
                  {loadingId === `edit-${editingUmkm.slug}` ? <Loader2 size={16} className="animate-spin" /> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAFTAR UMKM LIST */}
      <div className="grid grid-cols-1 gap-4">
        {umkmsList.map((umkm) => (
          <div key={umkm.id} className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            {/* Header UMKM */}
            <div className="p-5 flex items-start gap-4">
              <img src={umkm.imageUrl} alt={umkm.name} className="w-16 h-16 rounded-md object-cover bg-slate-50 border border-slate-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-md font-bold tracking-tight text-slate-900">{umkm.name}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">{umkm.category?.name} &middot; {umkm.products?.length || 0} Produk</p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-1">{umkm.address}, Dusun {umkm.dusun}</p>

                    {/* STATUS GOOGLE MAPS LINK */}
                    <div className="mt-2">
                      {umkm.mapsUrl ? (
                        <a
                          href={umkm.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 hover:text-slate-950 font-medium transition-colors"
                        >
                          <MapPin size={12} />
                          <span>Google Maps Terkoneksi</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                          <MapPin size={12} />
                          <span>Peta Belum Ditambahkan</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleStartEdit(umkm)}
                      className="text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md flex items-center gap-1 text-xs font-semibold shadow-xs transition-colors"
                      title="Edit Data UMKM & Link Peta"
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      onClick={() => setExpandedUmkm(expandedUmkm === umkm.id ? null : umkm.id)}
                      className="text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md flex items-center gap-1 text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Package size={14} /> Produk
                      {expandedUmkm === umkm.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <button
                      onClick={() => handleDeleteUmkm(umkm.slug)}
                      disabled={loadingId === umkm.slug}
                      className="text-red-600 bg-white border border-slate-200 hover:bg-red-50 p-1.5 rounded-md transition-colors disabled:opacity-50"
                      title="Hapus UMKM"
                    >
                      {loadingId === umkm.slug ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Kelola Produk (Expanded) */}
            {expandedUmkm === umkm.id && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Form Tambah Produk */}
                  <div className="md:col-span-1 border-r border-slate-200 pr-6">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Tambah Produk Baru</h5>
                    <form onSubmit={(e) => handleAddProduct(e, umkm.id)} className="space-y-3">
                      <input type="text" required placeholder="Nama Produk" value={productData.title} onChange={(e) => setProductData({ ...productData, title: e.target.value })} className={inputClass} />
                      <input type="number" required placeholder="Harga (Rp)" min={0} value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} className={inputClass} />
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-600">Gambar Produk (Pilih File / URL)</label>
                        <input type="file" accept="image/*" onChange={handleProductImageChange} className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-slate-200 file:text-[11px] cursor-pointer" />
                        <input
                          type="text"
                          placeholder="atau tempel URL gambar (https://...)"
                          value={productData.imageUrl.startsWith("data:") ? "" : productData.imageUrl}
                          onChange={(e) => setProductData({ ...productData, imageUrl: e.target.value })}
                          className={inputClass}
                        />
                        {productData.imageUrl && <img src={productData.imageUrl} alt="preview" className="w-10 h-10 rounded object-cover border border-slate-200 mt-1" />}
                      </div>
                      <textarea required placeholder="Deskripsi Singkat" rows={2} value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} className={`${inputClass} resize-none`} />
                      <button type="submit" disabled={loadingId === "add-product"} className="w-full bg-slate-900 text-white hover:bg-slate-800 py-2 rounded-md text-xs font-semibold transition-colors">
                        {loadingId === "add-product" ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Simpan Produk"}
                      </button>
                    </form>
                  </div>

                  {/* List Produk */}
                  <div className="md:col-span-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Daftar Produk</h5>
                    {umkm.products?.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">Belum ada produk untuk UMKM ini.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {umkm.products?.map((prod: any) => (
                          <div key={prod.id} className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3">
                            <img src={prod.imageUrl} alt={prod.title} className="w-12 h-12 rounded object-cover bg-slate-50 border border-slate-100 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 text-xs truncate">{prod.title}</p>
                              <p className="text-slate-500 text-xs mt-0.5">Rp {prod.price.toLocaleString("id-ID")}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              disabled={loadingId === prod.id}
                              className="text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors"
                            >
                              {loadingId === prod.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
