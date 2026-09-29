import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { getApplicationById, reviewApplication } from "@/server/repo/partners";

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
  if (!getApplicationById(id)) {
    return NextResponse.json({ error: "درخواست پیدا نشد" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const decision = body?.decision;
  if (decision !== "APPROVED" && decision !== "REJECTED") {
    return NextResponse.json({ error: "تصمیم نامعتبر است" }, { status: 400 });
  }
  const note = String(body?.note ?? "").trim().slice(0, 500) || null;

  const application = reviewApplication(id, decision, note);
  return NextResponse.json({ application });
}
