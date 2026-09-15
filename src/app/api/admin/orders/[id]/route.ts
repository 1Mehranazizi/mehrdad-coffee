import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { getOrderById, updateOrderStatus, type OrderStatus } from "@/server/repo/orders";

const VALID: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

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
  if (!getOrderById(id)) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const status = body?.status as OrderStatus;
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "وضعیت نامعتبر است" }, { status: 400 });
  }
  updateOrderStatus(id, status);
  return NextResponse.json({ order: getOrderById(id) });
}
