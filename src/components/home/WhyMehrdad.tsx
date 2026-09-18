"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "سارا محمدی",
    text: "عطر قهوه واقعاً تازه بود. چیزی که بیشتر از همه دوست داشتم این بود که طعمش بعد از دم‌آوری هم کاملاً متعادل موند.",
  },
  {
    name: "علی رضایی",
    text: "برای اسپرسو گرفتم و واقعاً راضی بودم. رستش دقیقاً همون چیزی بود که دنبالش می‌گشتم؛ نه تلخ و سنگین، نه بی‌مزه.",
  },
  {
    name: "مریم احمدی",
    text: "بسته‌بندی خیلی تمیز بود و قهوه هم فوق‌العاده خوش‌عطر رسید. قطعاً دوباره سفارش می‌دم.",
  },
];

const reasons = [
  {
    number: "01",
    title: "انتخاب دقیق دانه",
    description:
      "دانه‌های قهوه را با دقت انتخاب می‌کنیم تا هر محصول شخصیت و کیفیت خودش را داشته باشد.",
  },
  {
    number: "02",
    title: "رست تخصصی",
    description:
      "رست قهوه را به متخصص‌های باتجربه می‌سپاریم تا هر دانه با پروفایل مناسب خودش آماده شود.",
  },
  {
    number: "03",
    title: "تازه برای شما",
    description:
      "تلاش می‌کنیم قهوه در بهترین شرایط به دست شما برسد تا عطر و طعم واقعی آن را تجربه کنید.",
  },
];

export default function WhyMehrdad() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-paper py-20 md:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-coffee/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="mb-14 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-brass">
              <span className="h-px w-8 bg-brass" />
              MEHRDAD COFFEE
            </span>

            <h2 className="max-w-md text-2xl sm:text-3xl font-extrabold leading-[1.2] tracking-tight text-ink">
              چرا قهوه
              <span className="text-coffee"> مهرداد؟</span>
            </h2>
          </div>
        </div>

        {/* Reasons */}
        <div className="mb-20 grid overflow-hidden rounded-3xl border border-line bg-cream md:grid-cols-3">
          {reasons.map((reason, index) => (
            <div
              key={reason.number}
              className={`group p-7 md:p-9 ${
                index !== reasons.length - 1
                  ? "border-b border-line md:border-b-0 md:border-l"
                  : ""
              }`}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-xs text-brass">
                  {reason.number}
                </span>

                <div className="h-2 w-2 rounded-full bg-coffee transition-transform duration-300 group-hover:scale-150" />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-ink">
                {reason.title}
              </h3>

              <p className="text-sm leading-7 text-ink-soft">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          {/* Intro */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="mb-4 block text-xs tracking-[0.18em] text-brass">
                CUSTOMER STORIES
              </span>

              <h3 className="text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
                چیزی که
                <br />
                مشتری‌ها می‌گویند.
              </h3>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-ink-soft">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-brass text-brass" />
                ))}
              </div>
              <span>تجربه واقعی مشتری‌ها</span>
            </div>
          </div>

          {/* Testimonials */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="min-w-[85%] snap-start rounded-3xl border border-line bg-cream p-7 md:min-w-[320px] md:p-8"
              >
                <Quote className="mb-8 h-8 w-8 text-brass/60" />

                <p className="mb-8 min-h-[120px] text-[15px] leading-8 text-ink">
                  «{testimonial.text}»
                </p>

                <div className="flex items-center justify-between border-t border-line pt-5">
                  <span className="text-sm font-medium text-ink">
                    {testimonial.name}
                  </span>

                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 fill-brass text-brass"
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
