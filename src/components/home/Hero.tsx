import Link from "next/link";
import { Sparkle } from "@/components/icons";
import Image from "next/image";

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
          maskImage: "linear-gradient(to bottom left, black, transparent 45%)",
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
            قهوه‌ای که <br />
            بوی خانه می‌دهد
          </h1>

          <p className="mt-6 max-w-md mx-auto md:mx-0 text-ink-soft leading-8">
            دانه‌های قهوه را با دقت انتخاب می‌کنیم و رست آن را به متخصص‌های
            باتجربه می‌سپاریم؛ تا قهوه‌ای تازه، خوش‌عطر و متناسب با سلیقه‌تان به
            دست شما برسد.
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

        {/* brand emblem — left side in RTL */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <Image
            src="/images/hero.jpg"
            className="object-contain w-full h-full rounded-full"
            width={400}
            height={400}
            alt="mehrdad coffee"
          />
          <div className="absolute bottom-2 right-1/2 translate-x-1/2 sm:right-4 sm:translate-x-0 rounded-full bg-ink px-5 py-2 text-xs sm:text-sm font-semibold text-cream shadow-lg whitespace-nowrap">
            دان تازه، رست هفتگی
          </div>
        </div>
      </div>
    </section>
  );
}
