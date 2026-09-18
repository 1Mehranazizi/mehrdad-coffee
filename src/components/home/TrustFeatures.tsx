"use client";

import {
  Truck,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

const features = [
  {
    title: "ارسال به سراسر ایران",
    description: "سفارش شما با بسته‌بندی مناسب به سراسر ایران ارسال می‌شود.",
    icon: Truck,
  },
  {
    title: "بسته‌بندی وکیوم تازه",
    description: "برای حفظ عطر، طعم و تازگی قهوه تا زمان رسیدن به دست شما.",
    icon: PackageCheck,
  },
  {
    title: "ضمانت بازگشت کالا",
    description: "خریدی مطمئن با امکان بازگشت کالا طبق شرایط فروشگاه.",
    icon: RotateCcw,
  },
];

export default function TrustFeatures() {
  return (
    <section
      dir="rtl"
      className="border rounded-2xl border-line bg-paper max-w-7xl mx-auto"
    >
      <div className="grid w-full md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className={`
                flex items-center gap-4 px-6 py-6
                md:px-8 md:py-7
                ${
                  index !== features.length - 1
                    ? "border-b border-line md:border-b-0 md:border-l"
                    : ""
                }
              `}
            >
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper-deep text-coffee">
                <Icon
                  strokeWidth={1.7}
                  className="h-5 w-5"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  {feature.title}
                </h3>

                <p className="mt-1 text-xs leading-6 text-ink-soft">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}