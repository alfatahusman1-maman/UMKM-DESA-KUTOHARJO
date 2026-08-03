import { NextRequest, NextResponse } from "next/server";
import { getCategoriesStore } from "@/lib/store";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/categories`, {
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

  return NextResponse.json({ success: true, data: getCategoriesStore() });
}
