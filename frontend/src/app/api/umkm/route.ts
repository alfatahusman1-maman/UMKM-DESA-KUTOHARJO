import { NextRequest, NextResponse } from "next/server";
import { getUmkmsStore, addUmkmStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const backendRes = await fetch(`${BACKEND_URL}/api/umkm${url.search}`, {
      headers: req.headers,
      cache: "no-store",
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Backend server unavailable
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || undefined;
  const category = url.searchParams.get("category") || undefined;
  const dusun = url.searchParams.get("dusun") || undefined;

  const data = getUmkmsStore({ search, category, dusun });
  return NextResponse.json({
    success: true,
    data,
    meta: { page: 1, limit: 50, total: data.length, totalPages: 1 },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/umkm`, {
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

  const created = addUmkmStore(body);
  return NextResponse.json({ success: true, message: "UMKM berhasil ditambahkan.", data: created }, { status: 201 });
}
