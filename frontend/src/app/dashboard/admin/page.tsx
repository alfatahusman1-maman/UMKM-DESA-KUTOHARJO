import { fetchAdminStats } from "@/lib/api";
import { Store, CheckCircle, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const { stats, recentPending } = await fetchAdminStats();

  const statCards = [
    { title: "Total UMKM", value: stats.totalUmkm, icon: <Store size={18} />, color: "text-slate-900", bg: "bg-slate-50 border border-slate-200" },
    { title: "Terverifikasi", value: stats.verifiedUmkm, icon: <CheckCircle size={18} />, color: "text-emerald-700", bg: "bg-emerald-50/50 border border-emerald-100" },
    { title: "Menunggu Verifikasi", value: stats.pendingUmkm, icon: <Clock size={18} />, color: "text-amber-700", bg: "bg-amber-50/50 border border-amber-100" },
    { title: "Total Pengguna", value: stats.totalUser, icon: <Users size={18} />, color: "text-indigo-700", bg: "bg-indigo-50/50 border border-indigo-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-lg ${stat.bg} flex flex-col justify-between h-28`}>
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">{stat.title}</span>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-md font-semibold text-slate-950">Menunggu Verifikasi</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar merchant baru yang membutuhkan verifikasi Anda.</p>
          </div>
          <Link href="/dashboard/admin/verify" className="text-xs font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {recentPending.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg">
            Tidak ada UMKM yang menunggu verifikasi saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium text-xs">
                  <th className="pb-3 text-left">Nama Usaha</th>
                  <th className="pb-3 text-left">Pemilik</th>
                  <th className="pb-3 text-left">Kategori</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPending.map((umkm: any) => (
                  <tr key={umkm.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{umkm.name}</td>
                    <td className="py-3 text-slate-600">{umkm.ownerName || "Tidak ada"}</td>
                    <td className="py-3">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                        {umkm.category?.name || "Lainnya"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link href="/dashboard/admin/verify" className="text-xs font-semibold text-slate-900 hover:underline">
                        Tinjau
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

