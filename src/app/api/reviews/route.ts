import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/auth/customer";
import { getProductById } from "@/server/repo/products";
import {
  createReview,
  hasCustomerReviewedProduct,
} from "@/server/repo/reviews";
import { hasCustomerPurchasedProduct } from "@/server/repo/customers";

export async function POST(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const productId = body?.productId as string | undefined;
  const rating = Number(body?.rating);
  const comment = String(body?.comment ?? "").trim();

  if (!productId || !getProductById(productId)) {
    return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "امتیاز نامعتبر است" }, { status: 400 });
  }
  if (comment.length < 3) {
    return NextResponse.json({ error: "متن نظر خیلی کوتاه است" }, { status: 400 });
  }

  if (!hasCustomerPurchasedProduct(customer.id, productId)) {
    return NextResponse.json(
      { error: "فقط خریداران این محصول می‌توانند نظر ثبت کنند" },
      { status: 403 }
    );
  }
  if (hasCustomerReviewedProduct(customer.id, productId)) {
    return NextResponse.json(
      { error: "شما قبلاً برای این محصول نظر ثبت کرده‌اید" },
      { status: 409 }
    );
  }

  const review = createReview({ productId, customerId: customer.id, rating, comment });
  return NextResponse.json({ review });
}
