import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/auth/customer";
import { createOrderFromCart, setOrderPaymentAuthority } from "@/server/repo/orders";
import { createAddress } from "@/server/repo/addresses";
import { requestPayment } from "@/server/payment/zarinpal";
import { quoteShipping } from "@/server/shipping";
import { isPartnerCustomer } from "@/server/repo/customers";

export async function POST(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : [];
  const { receiverName, receiverPhone, province, city, addressLine, postalCode } =
    body ?? {};

  if (!items.length) {
    return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
  }
  const required = { receiverName, receiverPhone, province, city, addressLine };
  for (const [key, value] of Object.entries(required)) {
    if (!value || String(value).trim() === "") {
      return NextResponse.json(
        { error: "لطفاً اطلاعات گیرنده و آدرس را کامل وارد کنید" },
        { status: 400 }
      );
    }
  }

  // Shipping is always computed on the server: free only for Kermanshah, Postex price otherwise.
  const partner = isPartnerCustomer(customer);
  const quote = await quoteShipping(
    items,
    {
      province,
      city,
      addressLine,
      postalCode,
      receiverName,
      receiverPhone,
    },
    partner
  );
  if (!quote.ok) {
    return NextResponse.json({ error: quote.error }, { status: 400 });
  }

  const { order, error } = createOrderFromCart({
    customerId: customer.id,
    items,
    shippingCost: quote.shippingCost,
    partner,
    receiverName,
    receiverPhone,
    province,
    city,
    addressLine,
    postalCode,
  });

  if (error || !order) {
    return NextResponse.json({ error: error || "خطا در ثبت سفارش" }, { status: 400 });
  }

  if (body?.saveAddress) {
    createAddress({
      customerId: customer.id,
      title: body.addressTitle || "آدرس جدید",
      province,
      city,
      addressLine,
      postalCode,
      receiverName,
      receiverPhone,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const payment = await requestPayment({
    amountToman: order.total,
    description: `پرداخت سفارش ${order.orderNumber}`,
    callbackUrl: `${baseUrl}/api/payment/callback`,
    mobile: receiverPhone,
  });

  if (!payment.ok || !payment.authority || !payment.paymentUrl) {
    return NextResponse.json(
      { error: payment.error || "اتصال به درگاه پرداخت ناموفق بود" },
      { status: 502 }
    );
  }

  setOrderPaymentAuthority(order.id, payment.authority);

  return NextResponse.json({ paymentUrl: payment.paymentUrl });
}
