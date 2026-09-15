import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearCartOnSuccess from "@/components/checkout/ClearCartOnSuccess";
import { getOrderByNumber } from "@/server/repo/orders";
import { formatToman } from "@/lib/products";

type SearchParams = Promise<{ order?: string; status?: string }>;

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { order: orderNumber, status } = await searchParams;
  const order = orderNumber ? getOrderByNumber(orderNumber) : undefined;
  const success = status === "success" && order?.status === "PAID";

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md rounded-2xl border border-line bg-cream p-8 text-center">
          {success ? (
            <>
              <ClearCartOnSuccess />
              <CheckCircle2 size={48} className="mx-auto text-coffee" />
              <h1 className="mt-4 text-xl font-extrabold text-ink">
                پرداخت با موفقیت انجام شد
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                شماره سفارش: <span dir="ltr">{order?.orderNumber}</span>
              </p>
              {order && (
                <p className="mt-1 text-sm text-ink-soft">
                  مبلغ پرداخت‌شده: {formatToman(order.total)}
                </p>
              )}
              <Link
                href="/account/orders"
                className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
              >
                مشاهده سفارش‌ها
              </Link>
            </>
          ) : (
            <>
              <XCircle size={48} className="mx-auto text-red-700" />
              <h1 className="mt-4 text-xl font-extrabold text-ink">
                پرداخت انجام نشد
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                {status === "canceled"
                  ? "پرداخت توسط شما لغو شد."
                  : "مشکلی در پرداخت پیش آمد. سبد خرید شما همچنان حفظ شده است."}
              </p>
              <Link
                href="/cart"
                className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
              >
                بازگشت به سبد خرید
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
