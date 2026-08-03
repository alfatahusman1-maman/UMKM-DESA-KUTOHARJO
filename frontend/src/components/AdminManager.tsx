"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, ShieldCheck, Mail } from "lucide-react";

export default function AdminManager({ initialAdmins }: { initialAdmins: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus Admin ini?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/superadmin/admins?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal menghapus admin");
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
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", email: "", password: "" });
        setIsAdding(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert("Gagal menambahkan admin: " + (data.error || ""));
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoadingId(null);
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors";
  const buttonPrimary = "inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50";
  const buttonSecondary = "inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold text-slate-900">Daftar Admin ({initialAdmins.length})</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={isAdding ? buttonSecondary : buttonPrimary}
        >
          {isAdding ? "Batal" : <><Plus size={16} /> Tambah Admin</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="text-md font-semibold text-slate-900 mb-4">Tambah Admin Baru</h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: budi@kutoharjo.desa.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Kata Sandi Sementara</label>
              <input
                type="text"
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loadingId === "add"}
                className={buttonPrimary}
              >
                {loadingId === "add" ? <Loader2 size={16} className="animate-spin" /> : "Simpan Admin"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialAdmins.map((admin) => (
          <div key={admin.id} className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-700">
                <ShieldCheck size={20} />
              </div>
              <button
                onClick={() => handleDelete(admin.id)}
                disabled={loadingId === admin.id}
                className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors disabled:opacity-50"
                title="Hapus Akun Admin"
              >
                {loadingId === admin.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm truncate">{admin.name}</h4>
              <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                <Mail size={12} />
                <span className="truncate">{admin.email}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
