import Link from "next/link";
import { AtSign, MapPin, Phone } from "lucide-react";
import { Sparkle } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-ink text-cream">
      {/* newsletter band */}
      <div className="border-b border-cream/10">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold">عضو خبرنامه قهوه مهرداد شوید</h3>
            <p className="mt-1 text-sm text-cream/60">
              از رست‌های تازه و تخفیف‌های فصلی باخبر شوید.
            </p>
          </div>
          <form className="flex w-full max-w-sm gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              ایمیل شما
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="ایمیل شما"
              className="min-w-0 flex-1 rounded-full border border-cream/20 bg-transparent px-4 py-2.5 text-sm placeholder:text-cream/40 focus:border-brass"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brass/90 transition-colors"
            >
              عضویت
            </button>
          </form>
        </div>
      </div>

      {/* link columns */}
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold">مهرداد</span>
            <span className="text-[10px] tracking-[0.2em] text-cream/50">
              COFFEE
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-cream/60">
            طعم اصالت، عطر ماندگار. قهوه‌ای که با دقت انتخاب و در کارمان تازه
            برشته می‌شود.
          </p>
          <a
            href="https://instagram.com/meehrdad_coffee"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-cream/70 hover:text-brass transition-colors"
          >
            <AtSign size={16} strokeWidth={1.75} />
            meehrdad_coffee
          </a>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream/90">دسترسی سریع</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/60">
            <li><Link href="/shop" className="hover:text-brass transition-colors">فروشگاه</Link></li>
            <li><Link href="/about" className="hover:text-brass transition-colors">درباره ما</Link></li>
            <li><Link href="/journal" className="hover:text-brass transition-colors">مجله قهوه</Link></li>
            <li><Link href="/contact" className="hover:text-brass transition-colors">تماس با ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream/90">خدمات مشتریان</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/60">
            <li><Link href="/faq" className="hover:text-brass transition-colors">سوالات متداول</Link></li>
            <li><Link href="/shipping" className="hover:text-brass transition-colors">راهنمای ارسال</Link></li>
            <li><Link href="/returns" className="hover:text-brass transition-colors">شرایط بازگشت کالا</Link></li>
            <li><Link href="/privacy" className="hover:text-brass transition-colors">حریم خصوصی</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream/90">تماس با ما</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/60">
            <li className="flex items-start gap-2">
              <MapPin size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              <span>کرمانشاه بلوار مهدیه ابتدای خیابان حاج محمد تقی اصفهانی قهوه مهرداد</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} strokeWidth={1.75} className="shrink-0" />
              <span dir="ltr">0918 233 6011</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© {year} قهوه مهرداد. تمامی حقوق محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            <Sparkle className="h-3 w-3 text-brass" />
            برشته‌کاری تازه
          </p>
        </div>
      </div>
    </footer>
  );
}
