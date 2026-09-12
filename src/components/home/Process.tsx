import { Flame, Package, Wheat } from "lucide-react";

const STEPS = [
  {
    icon: Wheat,
    title: "انتخاب دانه‌های ممتاز",
    text: "دانه‌های عربیکا را مستقیم از منابع معتبر و تازه‌رسیده انتخاب می‌کنیم.",
  },
  {
    icon: Flame,
    title: "برشته‌کاری",
    text: "هر بچ در تنوره‌ی خودمان و با دستور رست اختصاصی مهرداد برشته می‌شود.",
  },
  {
    icon: Package,
    title: "بسته‌بندی و ارسال تازه",
    text: "همان روز رست، بسته‌بندی و به دست شما در سراسر ایران می‌رسد.",
  },
];

export default function Process() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center">
        از دانه تا فنجان
      </h2>

      <div className="mt-12 grid gap-10 sm:grid-cols-3 relative">
        <div
          aria-hidden="true"
          className="hidden sm:block absolute top-7 right-[16.5%] left-[16.5%] border-t-2 border-dashed border-line"
        />
        {STEPS.map((step) => (
          <div key={step.title} className="relative text-center">
            <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream">
              <step.icon size={24} strokeWidth={1.75} />
            </div>
            <h3 className="mt-5 font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft max-w-xs mx-auto">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
