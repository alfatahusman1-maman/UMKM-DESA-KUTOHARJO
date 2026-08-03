import { NextRequest, NextResponse } from "next/server";
import { deleteProductStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/products/${params.id}`, {
      method: "DELETE",
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }
  } catch (error) {
    // Fallback store
  }

  const deleted = deleteProductStore(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Gagal menghapus produk." }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Produk berhasil dihapus." });
}
