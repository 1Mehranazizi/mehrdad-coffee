import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { updateGrindType, deleteGrindType } from "@/server/repo/grind-types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
  updateGrindType(id, { title, sortOrder: Number(body?.sortOrder) || 0 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  deleteGrindType(id);
  return NextResponse.json({ ok: true });
}
