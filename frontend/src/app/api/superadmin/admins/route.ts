import { NextRequest, NextResponse } from "next/server";
import { getAdminsStore, createAdminStore, deleteUserStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/superadmin/admins`, { cache: "no-store" });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  return NextResponse.json({ success: true, data: getAdminsStore() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/superadmin/admins`, {
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

  const created = createAdminStore(body);
  return NextResponse.json({ success: true, message: "Admin berhasil ditambahkan.", data: created }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID Admin wajib diisi" }, { status: 400 });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/superadmin/admins?id=${id}`, {
      method: "DELETE",
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  deleteUserStore(id);
  return NextResponse.json({ success: true, message: "Admin berhasil dihapus." });
}
