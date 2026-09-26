import LegalPage from "@/components/legal/LegalPage";

const steps = [
  {
    number: "۰۱",
    title: "ثبت سفارش",
    description:
      "محصولات موردنظر خود را انتخاب کرده و پس از بررسی سبد خرید، اطلاعات لازم برای ارسال را وارد کنید.",
  },
  {
    number: "۰۲",
    title: "بررسی و آماده‌سازی",
    description:
      "پس از ثبت موفق سفارش، اطلاعات سفارش بررسی شده و محصولات برای ارسال آماده می‌شوند.",
  },
  {
    number: "۰۳",
    title: "تحویل به شرکت حمل",
    description:
      "سفارش پس از آماده‌سازی به روش ارسال انتخاب‌شده تحویل داده می‌شود.",
  },
  {
    number: "۰۴",
    title: "تحویل سفارش",
    description:
      "سفارش در آدرس ثبت‌شده توسط شما تحویل خواهد شد. زمان تحویل به مقصد و روش ارسال بستگی دارد.",
  },
];

export default function ShippingPage() {
  return (
    <LegalPage
      title="راهنمای ارسال"
      description="اطلاعات مربوط به آماده‌سازی، ارسال و تحویل سفارش‌های قهوه مهرداد."
    >
      <div className="mb-10">
        <h2 className="text-2xl font-bold">فرآیند ارسال سفارش</h2>

        <p className="mt-4 text-sm leading-8 text-ink-soft">
          تلاش ما این است که سفارش‌ها با دقت بسته‌بندی شده و در کوتاه‌ترین زمان
          ممکن برای ارسال آماده شوند.
        </p>
      </div>

      <div className="grid gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="group rounded-2xl border border-line bg-paper p-5 transition hover:border-brass/60"
          >
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coffee text-sm font-bold text-paper">
                {step.number}
              </div>

              <div>
                <h3 className="font-bold">{step.title}</h3>

                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brass/15 text-coffee">
            ✓
          </div>

          <h3 className="font-bold">نکات مهم هنگام ثبت آدرس</h3>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-ink-soft">
            <li>• آدرس را به‌صورت کامل و دقیق وارد کنید.</li>
            <li>• شماره تماس گیرنده باید صحیح و در دسترس باشد.</li>
            <li>• در صورت امکان، پلاک و واحد را نیز درج کنید.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brass/15 text-coffee">
            !
          </div>

          <h3 className="font-bold">توجه درباره زمان تحویل</h3>

          <p className="mt-4 text-sm leading-8 text-ink-soft">
            زمان تحویل ممکن است بر اساس شهر مقصد، شرایط شرکت حمل‌ونقل، تعطیلات
            رسمی و شرایط پیش‌بینی‌نشده تغییر کند. زمان تقریبی ارسال یا تحویل در
            هنگام ثبت سفارش به شما اطلاع داده می‌شود.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-paper-deep p-6">
        <h3 className="font-bold text-coffee">هزینه ارسال</h3>

        <p className="mt-3 text-sm leading-8 text-ink-soft">
          هزینه ارسال بر اساس مقصد و روش ارسال محاسبه می‌شود و پیش از نهایی کردن
          سفارش به شما نمایش داده خواهد شد. در صورت وجود شرایط ارسال رایگان،
          جزئیات آن در فروشگاه اعلام می‌شود.
        </p>
      </div>
    </LegalPage>
  );
}
