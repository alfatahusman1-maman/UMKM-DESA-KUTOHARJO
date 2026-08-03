import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchSiteSettings } from "@/lib/api";
import { redirect } from "next/navigation";
import SiteSettingsForm from "@/components/SiteSettingsForm";

export default async function SuperAdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/login");
  }

  const initialSettings = await fetchSiteSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-4">
        <h1 className="font-extrabold text-slate-900 text-2xl tracking-tight">Pengaturan Web</h1>
      </div>

      <SiteSettingsForm initialSettings={initialSettings} />
    </div>
  );
}
