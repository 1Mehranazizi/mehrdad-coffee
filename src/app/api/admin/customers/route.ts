import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { createCustomer } from "@/server/repo/customers";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
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
    const customer = createCustomer({ phone, name });
    return NextResponse.json({ customer }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "PHONE_EXISTS") {
      return NextResponse.json(
        { error: "مشتری‌ای با این شماره موبایل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }
    throw err;
  }
}
