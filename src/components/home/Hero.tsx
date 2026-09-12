import Image from "next/image";
import Link from "next/link";
import { SunburstMark, Sparkle } from "@/components/icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* faint diagonal crop-mark line, echoing the packaging artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 8px, var(--color-line) 8px, var(--color-line) 9px)",
          maskImage:
            "linear-gradient(to bottom left, black, transparent 45%)",
          WebkitMaskImage:
            "linear-gradient(to bottom left, black, transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        {/* text — right side in RTL */}
        <div className="text-center md:text-right">
          <p className="inline-flex items-center gap-2 text-sm text-coffee font-medium">
            <Sparkle className="h-3.5 w-3.5" />
            طعم اصالت، عطر ماندگار
          </p>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-ink">
            قهوه‌ای که بوی
            <br />
            خانه می‌دهد
          </h1>

          <p className="mt-6 max-w-md mx-auto md:mx-0 text-ink-soft leading-8">
            دانه‌های ممتاز عربیکا را انتخاب می‌کنیم، در اصفهان تازه برشته
            می‌کنیم و همان روز برایتان ارسال می‌کنیم؛ برای اسپرسو، فیلتر یا
            قهوه‌ی ترک، به سلیقه‌ی خودتان.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <Link
              href="/shop"
              className="w-full sm:w-auto rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors text-center"
            >
              مشاهده محصولات
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto rounded-full border border-ink/20 px-8 py-3.5 text-sm font-semibold text-ink hover:border-coffee hover:text-coffee transition-colors text-center"
            >
              داستان مهرداد
            </Link>
          </div>
        </div>

        {/* product visual — left side in RTL */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-paper-deep -z-10" />
          <div className="overflow-hidden rounded-[2rem] border border-line shadow-[0_30px_60px_-25px_rgba(32,28,23,0.35)]">
            <Image
              src="/images/package-front.png"
              alt="بسته‌بندی قهوه مهرداد"
              width={800}
              height={1200}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full bg-ink text-cream shadow-lg sm:h-28 sm:w-28">
            <SunburstMark className="h-14 w-14 sm:h-16 sm:w-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
