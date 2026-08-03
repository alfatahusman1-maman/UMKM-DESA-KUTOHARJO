import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchAdminStats } from "@/lib/api";
import { redirect } from "next/navigation";
import VerifyTable from "@/components/VerifyTable";

export default async function AdminVerifyPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    redirect("/login");
  }

  const token = (session as any)?.accessToken;
  const { recentPending } = await fetchAdminStats(token);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Verifikasi UMKM Pendaftar</h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar pendaftaran merchant/UMKM baru yang membutuhkan persetujuan dan verifikasi Admin.
        </p>
      </div>

      <VerifyTable initialUmkms={recentPending || []} />
    </div>
  );
}
