"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/api";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploadInput({ value, onChange, label = "Upload Gambar Usaha / Produk" }: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 5MB.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengupload gambar ke Cloudinary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>

      {value && (
        <div className="relative w-36 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-2">
          <img src={value} alt="Preview Upload" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 hover:bg-rose-600 transition-colors"
            title="Hapus Gambar"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-emerald-600 hover:text-emerald-600 px-3.5 py-2 rounded-md text-xs font-semibold text-slate-700 transition-colors shadow-2xs">
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          <span>{loading ? "Mengupload ke Cloudinary..." : "Pilih File Gambar"}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="hidden" />
        </label>
        {loading && (
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}
      <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP, GIF (Maks. 5MB). Otomatis disimpan ke Cloudinary.</p>
    </div>
  );
}
