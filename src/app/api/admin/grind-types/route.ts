import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { listGrindTypes, createGrindType } from "@/server/repo/grind-types";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  return NextResponse.json({ grindTypes: listGrindTypes() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
  const grindType = createGrindType({ title, sortOrder: Number(body?.sortOrder) || 0 });
  return NextResponse.json({ grindType });
}
