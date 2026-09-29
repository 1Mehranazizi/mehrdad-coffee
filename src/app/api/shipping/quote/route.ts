import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/auth/customer";
import { quoteShipping } from "@/server/shipping";
import { isPartnerCustomer } from "@/server/repo/customers";

export async function POST(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : [];
  const { province, city, addressLine, postalCode, receiverName, receiverPhone } = body ?? {};

  if (!items.length || !province || !city) {
    return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
  }

  const quote = await quoteShipping(items, {
    province: String(province),
    city: String(city),
    addressLine: String(addressLine || ""),
    postalCode: postalCode ? String(postalCode) : null,
    receiverName: String(receiverName || ""),
    receiverPhone: String(receiverPhone || ""),
  }, isPartnerCustomer(customer));

  if (!quote.ok) return NextResponse.json({ error: quote.error }, { status: 400 });
  return NextResponse.json(quote);
}
