import { NextRequest, NextResponse } from "next/server";
import { deleteUmkmStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { umkmId } = body;

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/admin/delete`, {
      method: "POST",
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

  deleteUmkmStore(umkmId);
  return NextResponse.json({ success: true, message: "UMKM berhasil dihapus oleh admin." });
}
