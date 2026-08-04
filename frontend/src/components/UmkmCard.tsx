"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/utils";
import type { Umkm } from "@/lib/types";
import GoogleMapEmbed from "./GoogleMapEmbed";

export default function UmkmCard({ umkm }: { umkm: Umkm }) {
  const [showMapModal, setShowMapModal] = useState(false);
  const categoryName = umkm?.category?.name || "UMKM";
  const isKuliner = categoryName.toLowerCase().includes("kuliner");
  const imageUrl = umkm?.imageUrl || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800";
  const certifications = umkm?.certifications && umkm.certifications.length > 0
    ? umkm.certifications
    : (isKuliner ? ["Halal MUI"] : []);
  const ratingVal = umkm?.rating ? Number(umkm.rating).toFixed(1) : "5.0";

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200/90 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-200">
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={umkm?.name || "UMKM"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-2xs border border-slate-200/50">
            {categoryName}
          </span>
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            {certifications.slice(0, 2).map((cert, idx) => (
              <span
                key={idx}
                className="bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 text-[10px] font-semibold"
                title={cert}
              >
                <span className="material-symbols-outlined text-[12px]">verified</span>
                <span>{cert}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight line-clamp-1 group-hover:text-slate-700 transition-colors">
                {umkm?.name || "Nama UMKM"}
              </h4>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm shrink-0">
                <span className="text-amber-500">★</span>
                <span>{ratingVal}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
              {umkm?.description || ""}
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-slate-400">location_on</span>
                <span className="font-medium text-slate-700 text-[11px]">Dusun {umkm?.dusun || "-"}</span>
              </div>
              {umkm?.mapsUrl && (
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="text-[11px] text-slate-700 font-semibold hover:text-slate-950 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">map</span>
                  <span>Peta</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={buildWhatsAppLink(umkm?.whatsappNumber || "", umkm?.name || "")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-2xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp</span>
              </a>

              <Link
                href={`/umkm/${umkm?.slug || ""}`}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <span>Detail</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP PREVIEW PETA GOOGLE MAPS */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-5 max-w-lg w-full border border-slate-200 shadow-xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="material-symbols-outlined text-slate-700 text-[18px]">location_on</span>
                <span className="truncate">{umkm.name}</span>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <GoogleMapEmbed
              mapsUrl={umkm.mapsUrl}
              address={umkm.address}
              name={umkm.name}
              height="280px"
            />

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="px-4 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Tutup Peta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
