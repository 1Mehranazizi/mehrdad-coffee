import { NextResponse } from "next/server";
import { isValidLocation } from "@/lib/iran-locations";
import { getCurrentCustomer } from "@/server/auth/customer";
import { listAddressesByCustomer, createAddress } from "@/server/repo/addresses";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  return NextResponse.json({ addresses: listAddressesByCustomer(customer.id) });
}

export async function POST(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const required = ["title", "province", "city", "addressLine", "receiverName", "receiverPhone"];
  for (const field of required) {
    if (!body?.[field] || String(body[field]).trim() === "") {
      return NextResponse.json({ error: "لطفاً همه‌ی فیلدهای ضروری را پر کنید" }, { status: 400 });
    }
  }

  if (!isValidLocation(String(body.province), String(body.city))) {
    return NextResponse.json({ error: "استان یا شهر انتخاب‌شده معتبر نیست" }, { status: 400 });
  }

  const address = createAddress({
    customerId: customer.id,
    title: body.title,
    province: body.province,
    city: body.city,
    addressLine: body.addressLine,
    postalCode: body.postalCode,
    receiverName: body.receiverName,
    receiverPhone: body.receiverPhone,
    isDefault: Boolean(body.isDefault),
  });
  return NextResponse.json({ address });
}
