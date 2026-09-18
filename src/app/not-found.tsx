import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SunburstMark } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm text-center">
          <SunburstMark className="h-20 w-20 mx-auto text-ink" />
          <p className="mt-6 text-6xl font-extrabold text-ink">۴۰۴</p>
          <h1 className="mt-3 text-xl font-bold text-ink">
            این صفحه پیدا نشد
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            ممکن است لینک اشتباه باشد یا این صفحه جابه‌جا شده باشد.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
            >
              بازگشت به خانه
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-coffee transition-colors"
            >
              مشاهده فروشگاه
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
