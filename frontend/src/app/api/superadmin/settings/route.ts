import { NextRequest, NextResponse } from "next/server";
import { getSiteSettingsStore, updateSiteSettingsStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/superadmin/settings`, { cache: "no-store" });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  return NextResponse.json({ success: true, data: getSiteSettingsStore() });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/superadmin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  const updated = updateSiteSettingsStore(body);
  return NextResponse.json({ success: true, message: "Pengaturan situs berhasil diperbarui.", data: updated });
}
