import Link from "next/link";
import { categories } from "@/lib/products";

export default function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
          انواع قهوه مهرداد
        </h2>
        <Link
          href="/shop"
          className="hidden sm:inline text-sm text-coffee hover:text-coffee-deep transition-colors shrink-0"
        >
          مشاهده همه ←
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group rounded-2xl border border-line bg-cream p-6 transition-colors hover:border-coffee"
          >
            <h3 className="text-lg font-bold text-ink group-hover:text-coffee transition-colors">
              {cat.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
