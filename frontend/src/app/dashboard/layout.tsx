import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <DashboardSidebar role={session.user.role} />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Halo, {session.user.name} 👋
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Selamat datang di panel kontrol dashboard Anda.
            </p>
          </div>
          <div className="hidden sm:block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            Role: {session.user.role}
          </div>
        </header>
        
        <main className="animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

