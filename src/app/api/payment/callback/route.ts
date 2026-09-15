import { NextResponse } from "next/server";
import { getOrderByAuthority, markOrderPaid, updateOrderStatus } from "@/server/repo/orders";
import { verifyPayment } from "@/server/payment/zarinpal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authority = url.searchParams.get("Authority") || "";
  const status = url.searchParams.get("Status") || "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || url.origin;

  const order = getOrderByAuthority(authority);
  if (!order) {
    return NextResponse.redirect(`${baseUrl}/checkout/result?status=failed`);
  }

  if (status !== "OK") {
    updateOrderStatus(order.id, "CANCELED");
    return NextResponse.redirect(
      `${baseUrl}/checkout/result?order=${order.orderNumber}&status=canceled`
    );
  }

  const verification = await verifyPayment({ authority, amountToman: order.total });
  if (!verification.ok || !verification.refId) {
    return NextResponse.redirect(
      `${baseUrl}/checkout/result?order=${order.orderNumber}&status=failed`
    );
  }

  markOrderPaid(order.id, verification.refId);
  return NextResponse.redirect(
    `${baseUrl}/checkout/result?order=${order.orderNumber}&status=success`
  );
}
