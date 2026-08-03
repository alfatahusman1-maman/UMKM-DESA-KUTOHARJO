import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUserStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userIdentifier = session?.user?.id || session?.user?.email || "usr-admin";

  const body = await req.json();

  try {
    const token = (session as any)?.accessToken;
    const backendRes = await fetch(`${BACKEND_URL}/api/user/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  const updated = updateUserStore(userIdentifier, body) || updateUserStore("usr-admin", body);
  if (!updated) {
    return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Profil berhasil diperbarui.", user: updated });
}
