import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminManager from "@/components/AdminManager";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/login");
  }

  let admins = [];
  try {
    const token = (session as any).accessToken;
    const res = await fetch(`${BACKEND_URL}/api/superadmin/admins`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      admins = json.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch admins:", err);
  }

  return (
    <div className="space-y-lg">
      <div className="mb-xl">
        <h1 className="font-headline-lg text-primary text-2xl mb-xs">Kelola Akses Admin</h1>
        <p className="font-body-md text-on-surface-variant">
          Super Admin dapat menambahkan atau menghapus akun Admin yang bertugas mengelola data UMKM di desa.
        </p>
      </div>

      <AdminManager initialAdmins={admins} />
    </div>
  );
}
