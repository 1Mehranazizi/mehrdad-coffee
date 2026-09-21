import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import {
  getOrderById,
  getOrderDetail,
  isOrderStatus,
  updateOrderStatus,
} from "@/server/repo/orders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  const order = getOrderDetail(id);
  if (!order) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
  return NextResponse.json({ order });
}

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
  const status = body?.status;
  if (!isOrderStatus(status)) {
    return NextResponse.json({ error: "وضعیت نامعتبر است" }, { status: 400 });
  }
  updateOrderStatus(id, status);
  return NextResponse.json({ order: getOrderDetail(id) });
}
