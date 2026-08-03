"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface LoginFormProps {
  loginImage?: string;
  loginBannerTitle?: string;
  loginBannerSubtitle?: string;
  loginFormTitle?: string;
  loginFormSubtitle?: string;
}

export default function LoginForm({
  loginImage,
  loginBannerTitle = "Kutoharjo UMKM Hub",
  loginBannerSubtitle = "Mari bersama memajukan ekonomi lokal melalui digitalisasi UMKM Desa Kutoharjo.",
  loginFormTitle = "Selamat Datang",
  loginFormSubtitle = "Masuk ke akun merchant atau admin Anda.",
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
      setIsLoading(false);
    }
  };

  const imageSrc = loginImage || "/images/login-hero.png";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm border border-slate-200">
        {/* Bagian Kiri - Gambar Banner */}
        <div className="md:w-1/2 relative min-h-[320px] md:min-h-[440px] hidden md:block bg-slate-900">
          <Image
            src={imageSrc}
            alt="Digitalisasi UMKM"
            fill
            className="object-cover opacity-80"
            priority
            unoptimized={imageSrc.startsWith("data:")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex items-end p-8">
            <div className="text-white">
              <h3 className="font-bold text-lg text-white mb-1.5 tracking-tight">{loginBannerTitle}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {loginBannerSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Bagian Kanan - Form Login */}
        <div className="md:w-1/2 p-6 sm:p-8 bg-white relative flex flex-col justify-center">
          <Link
            href="/"
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            title="Kembali ke Beranda"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          
          <div className="mb-6 mt-2">
            <h1 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{loginFormTitle}</h1>
            <p className="text-xs text-slate-500">
              {loginFormSubtitle}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-slate-900 text-white font-semibold text-xs py-2.5 rounded-md hover:bg-slate-800 transition-colors shadow-2xs flex justify-center items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <span className="material-symbols-outlined text-[16px]">login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun UMKM?{" "}
              <Link href="/register" className="font-semibold text-slate-900 hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
