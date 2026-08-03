import { NextRequest, NextResponse } from "next/server";
import { getUmkmBySlugStore, updateUmkmStore, deleteUmkmStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Params {
  params: { slug: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/umkm/${params.slug}`, {
      headers: req.headers,
      cache: "no-store",
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  const umkm = getUmkmBySlugStore(params.slug);
  if (!umkm) {
    return NextResponse.json({ error: "UMKM tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: umkm });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/umkm/${params.slug}`, {
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

  const updated = updateUmkmStore(params.slug, body);
  if (!updated) {
    return NextResponse.json({ error: "Gagal memperbarui UMKM." }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "UMKM berhasil diperbarui.", data: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/umkm/${params.slug}`, {
      method: "DELETE",
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  const deleted = deleteUmkmStore(params.slug);
  if (!deleted) {
    return NextResponse.json({ error: "Gagal menghapus UMKM." }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "UMKM berhasil dihapus." });
}
