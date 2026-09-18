"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SunburstMark } from "@/components/icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm text-center">
          <SunburstMark className="h-20 w-20 mx-auto text-ink" />
          <h1 className="mt-6 text-xl font-bold text-ink">
            مشکلی پیش آمد
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            خطایی غیرمنتظره رخ داد. می‌توانید دوباره تلاش کنید یا به صفحه‌ی
            اصلی برگردید.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
            >
              تلاش دوباره
            </button>
            <Link
              href="/"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-coffee transition-colors"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
