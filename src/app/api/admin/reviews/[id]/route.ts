import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { setReviewApproval, deleteReview } from "@/server/repo/reviews";

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
  setReviewApproval(id, Boolean(body?.approved));
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
  deleteReview(id);
  return NextResponse.json({ ok: true });
}
