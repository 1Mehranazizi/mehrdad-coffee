"use client";

import { useSearchParams } from "next/navigation";
import { SunburstMark } from "@/components/icons";

export default function MockPayClient() {
  const params = useSearchParams();
  const authority = params.get("authority") || "";
  const callback = params.get("callback") || "/";

  const go = (status: "OK" | "NOK") => {
    const url = new URL(callback);
    url.searchParams.set("Authority", authority);
    url.searchParams.set("Status", status);
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-cream p-8 text-center">
        <SunburstMark className="h-14 w-14 mx-auto text-ink" />
        <h1 className="mt-4 text-lg font-bold text-ink">درگاه پرداخت آزمایشی</h1>
        <p className="mt-2 text-sm text-ink-soft">
          چون هنوز مرچنت کد واقعی زرین‌پال تنظیم نشده، این یک شبیه‌ساز
          پرداخت است — برای اتصال واقعی، مقدار{" "}
          <code dir="ltr" className="text-xs">ZARINPAL_MERCHANT_ID</code> را در
          فایل <code dir="ltr" className="text-xs">.env</code> تنظیم کنید.
        </p>
        <p className="mt-3 text-xs text-ink-soft/70" dir="ltr">
          Authority: {authority}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => go("OK")}
            className="rounded-full bg-ink py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
          >
            شبیه‌سازی پرداخت موفق
          </button>
          <button
            onClick={() => go("NOK")}
            className="rounded-full border border-line py-3 text-sm font-semibold text-ink hover:border-coffee transition-colors"
          >
            انصراف از پرداخت
          </button>
        </div>
      </div>
    </div>
  );
}
