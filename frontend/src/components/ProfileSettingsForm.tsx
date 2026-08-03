"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

export default function ProfileSettingsForm({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    profileImage: user.profileImage || "",
    password: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profil berhasil diperbarui!");
        setFormData({ ...formData, password: "" });
        router.refresh();
      } else {
        const data = await res.json();
        alert("Gagal memperbarui profil: " + JSON.stringify(data.error));
      }
    } catch (e) {
      alert("Terjadi kesalahan");
    }
    setLoading(false);
  };

  return (
    <div className="neumorphic-flat p-xl rounded-2xl border border-white/50 max-w-2xl">
      <h3 className="font-headline-md text-primary mb-md">Informasi Pribadi</h3>
      <form onSubmit={handleSubmit} className="space-y-md">
        
        <div className="space-y-xs">
          <label className="font-label-md text-on-surface">Nama Lengkap</label>
          <input
            type="text" required minLength={3}
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-xs">
          <label className="font-label-md text-on-surface">Foto Profil (Opsional)</label>
          <div className="flex items-center gap-md">
            {formData.profileImage && (
              <img src={formData.profileImage} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
            )}
            <input
              type="file" accept="image/*"
              onChange={handleImageChange}
              className="flex-1 bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
        </div>

        <div className="pt-md mt-md border-t border-outline-variant">
          <h3 className="font-headline-sm text-primary mb-sm">Ganti Kata Sandi</h3>
          <p className="font-body-sm text-on-surface-variant mb-md">Biarkan kosong jika tidak ingin mengubah kata sandi.</p>
          
          <div className="space-y-xs">
            <label className="font-label-md text-on-surface">Kata Sandi Baru</label>
            <input
              type="password" minLength={6}
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-surface border-none neumorphic-pressed rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Minimal 6 karakter"
            />
          </div>
        </div>

        <div className="flex justify-end pt-lg">
          <button
            type="submit" disabled={loading}
            className="inline-flex items-center gap-xs bg-primary text-white px-xl py-sm rounded-lg font-label-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
