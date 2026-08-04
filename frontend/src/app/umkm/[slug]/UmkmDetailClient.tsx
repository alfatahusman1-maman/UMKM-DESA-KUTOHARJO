"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Umkm, Review } from "@/lib/types";
import { buildWhatsAppLink, formatRupiah } from "@/lib/utils";
import { submitReview } from "@/lib/api";

interface Props {
  umkm: Umkm;
  settings: any;
}

export default function UmkmDetailClient({ umkm, settings }: Props) {
  const [reviews, setReviews] = useState<Review[]>(umkm.reviews || []);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const isKuliner = umkm.category?.name?.toLowerCase().includes("kuliner");
  const certifications = umkm.certifications && umkm.certifications.length > 0
    ? umkm.certifications
    : (isKuliner ? ["Halal MUI"] : []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) {
      setFeedbackMsg({ text: "Harap isi nama dan komentar ulasan Anda.", isError: true });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await submitReview(umkm.id, {
        name: reviewerName,
        rating,
        comment,
      });

      const newReview: Review = res.data || {
        id: "rev-" + Date.now(),
        name: reviewerName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      setReviews([newReview, ...reviews]);
      setReviewerName("");
      setComment("");
      setRating(5);
      setFeedbackMsg({ text: "Terima kasih! Ulasan Anda berhasil dipublikasikan." });
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || "Gagal mengirim ulasan", isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const currentRating = umkm.rating ? Number(umkm.rating).toFixed(1) : "5.0";

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
            <Image src={umkm.imageUrl} alt={umkm.name} fill className="object-cover" priority />
          </div>

          {/* Badge Sertifikasi Legalitas UMKM */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {umkm.category && (
              <span className="bg-slate-100 text-slate-900 border border-slate-200 px-3 py-1 rounded-md text-xs font-bold">
                {umkm.category.name}
              </span>
            )}
            {certifications.map((cert, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{cert}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{umkm.name}</h1>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg text-amber-800">
              <span className="text-amber-500 font-bold text-sm">★</span>
              <span className="font-extrabold text-sm">{currentRating}</span>
              <span className="text-xs text-amber-700 font-medium">({reviews.length} ulasan)</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Pemilik: <span className="font-semibold text-slate-700">{umkm.ownerName}</span> &middot; Dusun {umkm.dusun}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
            {umkm.description}
          </p>
        </div>

        {/* Section Sertifikasi Detail */}
        {certifications.length > 0 && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 text-emerald-950 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Sertifikasi Legalitas & Keunggulan</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                UMKM ini memiliki kelengkapan berkas legalitas: <strong className="underline">{certifications.join(", ")}</strong>.
              </p>
            </div>
          </div>
        )}

        {umkm.operationalHours && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px] text-slate-500">schedule</span>
              <span>Jam Operasional</span>
            </div>
            <p className="text-xs text-slate-600 pl-5">{umkm.operationalHours}</p>
          </div>
        )}

        {/* Galeri Produk */}
        {umkm.products && umkm.products.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-900 tracking-tight">Katalog & Galeri Produk Usaha</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {umkm.products.map((product: any) => (
                <div key={product.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="relative h-32 w-full bg-slate-100">
                    <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-xs text-slate-900 line-clamp-1">{product.title}</p>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">{formatRupiah(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fitur 6: Ulasan & Rating Pembeli */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-md font-bold text-slate-900 tracking-tight">Ulasan & Rating Pelanggan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Bagikan pengalaman Anda membeli produk dari {umkm.name}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900">{currentRating}</span>
              <span className="text-xs text-slate-400"> / 5.0</span>
            </div>
          </div>

          {/* Form Submit Review */}
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tulis Ulasan Anda</h4>

            {feedbackMsg && (
              <div
                className={`p-3 rounded-md text-xs font-medium ${
                  feedbackMsg.isError ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {feedbackMsg.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Pilih Rating Bintang</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl focus:outline-hidden transition-transform transform hover:scale-110"
                  >
                    <span className={star <= (hoverRating || rating) ? "text-amber-400" : "text-slate-300"}>★</span>
                  </button>
                ))}
                <span className="text-xs text-slate-600 font-semibold ml-2">{hoverRating || rating} / 5 Bintang</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Contoh: Ahmad Wijaya"
                required
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Komentar / Pengalaman Anda</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Tulis ulasan Anda tentang kualitas produk, rasa, pelayanan, atau pengiriman..."
                required
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
            >
              {submitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </form>

          {/* List Review */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ulasan Pengunjung ({reviews.length})</h4>
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada ulasan untuk UMKM ini. Jadilah yang pertama memberikan ulasan!</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-slate-100 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          {rev.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-xs text-slate-900">{rev.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {"★".repeat(rev.rating)}
                        <span className="text-slate-300">{"★".repeat(5 - rev.rating)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 pl-9">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 pl-9 block mt-1">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar contact card */}
      <aside className="bg-white border border-slate-200 rounded-lg p-6 h-fit sticky top-20 space-y-4 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Hubungi UMKM Ini</h3>

        <a
          href={buildWhatsAppLink(umkm.whatsappNumber, umkm.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-md text-xs font-semibold shadow-2xs transition-colors w-full"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>Hubungi via WhatsApp</span>
        </a>

        {umkm.mapsUrl && (
          <a
            href={umkm.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-md text-xs font-semibold shadow-2xs transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">map</span>
            <span>Buka di Google Maps</span>
          </a>
        )}

        {umkm.instagramUrl && (
          <a
            href={umkm.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-md text-xs font-semibold shadow-2xs transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">photo_camera</span>
            <span>Kunjungi Instagram</span>
          </a>
        )}

        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
          <div className="flex items-start gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">location_on</span>
            <span>{umkm.address}, Dusun {umkm.dusun}</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
