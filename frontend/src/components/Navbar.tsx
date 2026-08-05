"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const BASE_NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Daftar UMKM", href: "/umkm" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar({
  title = "Kutoharjo Hub",
  logo,
  hideNavLinks = false,
}: {
  title?: string;
  logo?: string;
  hideNavLinks?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Admin & Super Admin authenticate via /login by clicking logo/text header
  const brandHref = session ? "/dashboard" : "/login";
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const shouldHideNav = hideNavLinks || isDashboardRoute;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name -> Links to Login page, which authenticates Admin -> /dashboard/admin and Super Admin -> /dashboard/superadmin */}
        <Link
          href={brandHref}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          {logo ? (
            <img src={logo} alt={title} className="w-9 h-9 rounded-md object-cover border border-slate-200 bg-white" />
          ) : (
            <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
          )}
          <span className="font-bold text-slate-900 tracking-tight text-base group-hover:text-slate-700 transition-colors">
            {title}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {!shouldHideNav && (
          <nav className="hidden md:flex items-center gap-1">
            {BASE_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-950 font-bold"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Mobile Toggle Button */}
        {!shouldHideNav && (
          <button
            className="md:hidden w-9 h-9 rounded-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu navigasi"
          >
            <span className="material-symbols-outlined text-[22px]">
              {open ? "close" : "menu"}
            </span>
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      {!shouldHideNav && open && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
          {BASE_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
