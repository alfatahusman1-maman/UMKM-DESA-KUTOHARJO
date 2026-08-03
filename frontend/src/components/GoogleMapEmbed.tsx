"use client";

import { useState } from "react";
import { MapPin, ExternalLink, Map as MapIcon } from "lucide-react";

interface GoogleMapEmbedProps {
  mapsUrl?: string | null;
  address?: string;
  name?: string;
  height?: string;
  className?: string;
}

export function formatGoogleMapsEmbedUrl(mapsUrl?: string | null, address?: string): string {
  if (!mapsUrl && !address) return "";

  let url = (mapsUrl || "").trim();

  // If user pasted full <iframe> code, extract src attribute
  if (url.includes("<iframe")) {
    const srcMatch = url.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // If already an embed URL format
  if (url.includes("output=embed") || url.includes("/maps/embed")) {
    return url;
  }

  // Otherwise, use maps.google.com embed query parameter
  const query = url || `${address || ""}, Desa Kutoharjo`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export default function GoogleMapEmbed({
  mapsUrl,
  address,
  name = "Lokasi UMKM",
  height = "320px",
  className = "",
}: GoogleMapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const embedUrl = formatGoogleMapsEmbedUrl(mapsUrl, address);

  // External link for opening Google Maps in a new browser tab/app
  const directMapsUrl =
    mapsUrl && mapsUrl.trim().length > 0 && !mapsUrl.includes("<iframe")
      ? mapsUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address || "Kutoharjo"}`)}`;

  if (!embedUrl) {
    return (
      <div className={`neumorphic-pressed rounded-xl p-md text-center text-on-surface-variant text-sm flex items-center justify-center gap-xs ${className}`}>
        <MapIcon size={18} className="text-outline" />
        <span>Peta lokasi belum tersedia</span>
      </div>
    );
  }

  return (
    <div className={`neumorphic-flat rounded-2xl overflow-hidden border border-white/50 bg-white/40 shadow-sm flex flex-col ${className}`}>
      {/* Header bar */}
      <div className="p-sm px-md bg-white/60 backdrop-blur-md border-b border-white/60 flex items-center justify-between gap-sm">
        <div className="flex items-center gap-xs text-primary font-label-md text-sm min-w-0">
          <MapPin size={16} className="text-secondary flex-shrink-0" />
          <span className="truncate">{name}</span>
        </div>
        <a
          href={directMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-xs text-xs bg-primary/10 hover:bg-primary/20 text-primary px-xs py-xs rounded-lg font-label-sm transition-colors flex-shrink-0"
          title="Buka di Aplikasi Google Maps"
        >
          <span>Google Maps</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Map Iframe container */}
      <div className="relative w-full overflow-hidden bg-surface-container" style={{ height }}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/30 text-on-surface-variant text-xs font-label-sm">
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Memuat Peta Google Maps...</span>
            </div>
          </div>
        )}
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full"
          title={`Peta Lokasi ${name}`}
        />
      </div>
    </div>
  );
}
