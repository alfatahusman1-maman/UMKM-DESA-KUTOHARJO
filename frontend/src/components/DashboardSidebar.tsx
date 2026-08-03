"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarProps {
  role: string;
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const superAdminLinks = [
    { href: "/dashboard/superadmin", label: "Kelola Admin", icon: "admin_panel_settings" },
    { href: "/dashboard/admin/umkm", label: "Kelola Data UMKM", icon: "storefront" },
    { href: "/dashboard/superadmin/settings", label: "Pengaturan Web", icon: "settings_suggest" },
    { href: "/dashboard/settings", label: "Pengaturan Akun", icon: "manage_accounts" },
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Statistik Dashboard", icon: "dashboard" },
    { href: "/dashboard/admin/umkm", label: "Kelola Data UMKM", icon: "storefront" },
    { href: "/dashboard/settings", label: "Pengaturan Akun", icon: "manage_accounts" },
  ];

  const links = role === "SUPERADMIN" ? superAdminLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 flex flex-col hidden md:flex">
      <div className="p-3 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu Navigation
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-semibold text-xs transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isActive ? "text-white" : "text-slate-500"}`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md font-semibold text-xs text-red-600 hover:bg-red-50 transition-colors w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
