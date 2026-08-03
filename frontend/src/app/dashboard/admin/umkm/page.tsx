import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchCategories, fetchUmkms } from "@/lib/api";
import { redirect } from "next/navigation";
import UmkmManager from "@/components/UmkmManager";

export default async function AdminUmkmPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    redirect("/login");
  }

  const [umkmsRes, categories] = await Promise.all([
    fetchUmkms({ limit: 50 }),
    fetchCategories(),
  ]);

  const umkms = umkmsRes.data || [];

  return (
    <div className="space-y-lg">
      <div className="mb-xl">
        <h1 className="font-headline-lg text-primary text-2xl mb-xs">Kelola UMKM Desa</h1>
        <p className="font-body-md text-on-surface-variant">
          Admin memiliki akses penuh untuk menambah atau menghapus profil UMKM.
        </p>
      </div>

      <UmkmManager initialUmkms={umkms} categories={categories} />
    </div>
  );
}
