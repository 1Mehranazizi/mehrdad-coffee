import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SunburstMark, Sparkle } from "@/components/icons";

export const metadata = { title: "درباره ما | قهوه مهرداد" };

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-line bg-paper-deep/60">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center">
            <Sparkle className="h-5 w-5 mx-auto text-coffee" />
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-ink">
              داستان مهرداد
            </h1>
            <p className="mt-3 text-ink-soft">طعم اصالت، عطر ماندگار</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-14 grid gap-10 md:grid-cols-[1fr_auto] items-start">
          <div className="space-y-5 text-[15px] leading-8 text-ink-soft order-2 md:order-1">
            <p>
              قهوه مهرداد از کرمانشاه شروع شد؛ با این باور ساده که یک فنجان
              خوب، از انتخاب درست دانه شروع می‌شود. دانه‌های عربیکای ممتاز را
              از منابع معتبر انتخاب می‌کنیم و در کارگاه خودمان تازه برشته
              می‌کنیم.
            </p>
            <p>
              همه‌ی محصولات ما — از اسپرسو و فیلتر گرفته تا نسکافه، هات چاکلت
              و چای ماسالا — با همان دقت و توجه به کیفیت آماده و بسته‌بندی
              می‌شوند تا طعم و عطرشان تا رسیدن به دست شما حفظ شود.
            </p>
            <p>
              ما به رشد آرام و اصیل اعتقاد داریم؛ به همین دلیل هر بچ را با
              دقت رست می‌کنیم و همان روز آماده‌ی ارسال می‌کنیم.
            </p>
          </div>
          <div className="order-1 md:order-2 mx-auto">
            <SunburstMark className="h-32 w-32 text-ink" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
