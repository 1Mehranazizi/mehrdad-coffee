import { NextResponse } from "next/server";
import { isValidLocation } from "@/lib/iran-locations";
import { getCurrentCustomer } from "@/server/auth/customer";
import { getAddressById, updateAddress, deleteAddress } from "@/server/repo/addresses";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  const address = getAddressById(id);
  if (!address || address.customerId !== customer.id) {
    return NextResponse.json({ error: "آدرس پیدا نشد" }, { status: 404 });
  }

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

  updateAddress(id, {
    title: body.title,
    province: body.province,
    city: body.city,
    addressLine: body.addressLine,
    postalCode: body.postalCode,
    receiverName: body.receiverName,
    receiverPhone: body.receiverPhone,
    isDefault: Boolean(body.isDefault),
  });
  return NextResponse.json({ address: getAddressById(id) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  const address = getAddressById(id);
  if (!address || address.customerId !== customer.id) {
    return NextResponse.json({ error: "آدرس پیدا نشد" }, { status: 404 });
  }
  deleteAddress(id);
  return NextResponse.json({ ok: true });
}
