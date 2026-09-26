import Link from "next/link";
import { ReactNode } from "react";

type LegalPageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export default function LegalPage({
  eyebrow = "خدمات مشتریان",
  title,
  description,
  children,
}: LegalPageProps) {
  return (
    <main dir="rtl" className="min-h-screen bg-paper text-ink">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-paper-deep">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brass/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-coffee/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
          <div className="mb-5 flex items-center gap-3 text-sm text-coffee">
            <span className="h-px w-8 bg-brass" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="max-w-3xl text-3xl font-bold leading-[1.5] tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-5 max-w-2xl text-sm leading-8 text-ink-soft sm:text-base">
              {description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        <div className="rounded-3xl border border-line bg-cream p-5 shadow-[0_20px_60px_rgba(32,28,23,0.05)] sm:p-8 md:p-10">
          {children}
        </div>
      </section>

      {/* Customer service links */}
      <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-6">
        <div className="rounded-3xl bg-ink px-6 py-8 text-paper sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-brass">نیاز به راهنمایی دارید؟</p>
              <h2 className="mt-2 text-xl font-bold">
                خدمات مشتریان قهوه مهرداد
              </h2>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-paper/20 px-5 py-3 text-sm transition hover:border-brass hover:text-brass"
            >
              بازگشت به فروشگاه
              <span aria-hidden>←</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
