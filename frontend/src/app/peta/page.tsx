"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchUmkms, fetchSiteSettings } from "@/lib/api";
import { Umkm } from "@/lib/types";

// Dynamically import Leaflet components without SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function PetaDesaPage() {
  const [umkms, setUmkms] = useState<Umkm[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Import leaflet CSS and library dynamically in browser
    import("leaflet").then((leafletModule) => {
      setL(leafletModule.default || leafletModule);
    });

    const loadData = async () => {
      try {
        const [resUmkm, resSet] = await Promise.all([
          fetchUmkms({ limit: 100 }),
          fetchSiteSettings(),
        ]);
        setUmkms(resUmkm.data || []);
        setSettings(resSet);
      } catch (err) {
        console.error("Error loading map data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Default Centroid: Desa Korowelang Kulon / Kutoharjo, Cepiring, Kendal
  const centerLat = -6.8975;
  const centerLng = 110.1654;

  const customIcon = L
    ? new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between">
      {/* Import Leaflet CSS directly */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <div>
        <Navbar title={settings.navbar_title || "Portal UMKM Korowelang"} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>Fitur Peta Digital Interaktif</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Peta Persebaran UMKM Desa
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Eksplorasi lokasi fisik usaha mikro dan produk unggulan warga Desa Korowelang Kulon & Kutoharjo secara visual.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-500">Total Pin Terdaftar</span>
                <p className="text-2xl font-extrabold text-emerald-600">{umkms.length} UMKM</p>
              </div>
            </div>
          </div>

          {/* Container Peta Leaflet */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md h-[550px] relative">
            {loading || !L ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-3">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold">Memuat Peta Interaktif Leaflet.js...</p>
              </div>
            ) : (
              <MapContainer
                center={[centerLat, centerLng]}
                zoom={14}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {umkms.map((u, idx) => {
                  const lat = u.latitude ? parseFloat(String(u.latitude)) : centerLat + (idx % 3 === 0 ? 0.002 : -0.002) * idx;
                  const lng = u.longitude ? parseFloat(String(u.longitude)) : centerLng + (idx % 2 === 0 ? 0.003 : -0.003) * idx;

                  return (
                    <Marker key={u.id} position={[lat, lng]} icon={customIcon}>
                      <Popup>
                        <div className="p-1 max-w-xs space-y-2">
                          <div className="relative w-full h-24 rounded-md overflow-hidden bg-slate-100">
                            <img src={u.imageUrl} alt={u.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                              {u.category?.name || "UMKM Desa"}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-900 mt-1">{u.name}</h4>
                            <p className="text-xs text-slate-500">Pemilik: {u.ownerName} &middot; Dusun {u.dusun}</p>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{u.description}</p>
                          <Link
                            href={`/umkm/${u.slug}`}
                            className="inline-block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 rounded-md transition-colors"
                          >
                            Lihat Detail Usaha &rarr;
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>
        </main>
      </div>

      <Footer title={settings.navbar_title || "Portal UMKM Korowelang"} />
    </div>
  );
}
