import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/auth/customer";
import { updateCustomerName } from "@/server/repo/customers";

export async function PATCH(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "نام نمی‌تواند خالی باشد" }, { status: 400 });

  updateCustomerName(customer.id, name);
  return NextResponse.json({ ok: true });
}
