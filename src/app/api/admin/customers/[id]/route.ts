import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { getCustomerById, updateCustomer } from "@/server/repo/customers";
import { normalizePhone } from "@/lib/phone";

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
  if (!getCustomerById(id)) {
    return NextResponse.json({ error: "مشتری پیدا نشد" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const phone = normalizePhone(body?.phone);
  const name = String(body?.name ?? "").trim().slice(0, 100) || null;

  if (!phone) {
    return NextResponse.json(
      { error: "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)" },
      { status: 400 }
    );
  }

  try {
    const customer = updateCustomer(id, { phone, name });
    return NextResponse.json({ customer });
  } catch (err) {
    if (err instanceof Error && err.message === "PHONE_EXISTS") {
      return NextResponse.json(
        { error: "این شماره موبایل متعلق به مشتری دیگری است" },
        { status: 409 }
      );
    }
    throw err;
  }
}
