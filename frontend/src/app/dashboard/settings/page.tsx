import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = {
    name: session.user.name || "Pengguna",
    email: session.user.email || "",
    role: session.user.role || "ADMIN",
    profileImage: null,
  };

  return (
    <div className="space-y-lg">
      <div className="mb-xl flex items-center gap-md">
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-lg">
            {user.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="font-headline-lg text-primary text-2xl">{user.name}</h1>
          <p className="font-body-md text-on-surface-variant">{user.email} • {user.role}</p>
        </div>
      </div>

      <ProfileSettingsForm user={user} />
    </div>
  );
}
