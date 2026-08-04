import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import { fetchSiteSettings } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  const settings = await fetchSiteSettings();

  const navbarTitle = settings.navbar_title || "Kutoharjo Hub";
  const siteLogo = settings.site_logo || undefined;

  const loginImage = settings.login_image || undefined;
  const loginBannerTitle = settings.login_banner_title || undefined;
  const loginBannerSubtitle = settings.login_banner_subtitle || undefined;
  const loginFormTitle = settings.login_form_title || undefined;
  const loginFormSubtitle = settings.login_form_subtitle || undefined;

  const footerBio = settings.footer_bio || undefined;
  const footerCopyright = settings.footer_copyright || undefined;

  return (
    <>
      <Navbar title={navbarTitle} logo={siteLogo} />
      <main className="min-h-screen pt-24 pb-12 bg-surface text-on-surface flex items-center justify-center">
        <LoginForm
          loginImage={loginImage}
          loginBannerTitle={loginBannerTitle}
          loginBannerSubtitle={loginBannerSubtitle}
          loginFormTitle={loginFormTitle}
          loginFormSubtitle={loginFormSubtitle}
        />
      </main>
      <Footer title={navbarTitle} bio={footerBio} copyright={footerCopyright} />
    </>
  );
}
