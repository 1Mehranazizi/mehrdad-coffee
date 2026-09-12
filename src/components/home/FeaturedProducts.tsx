import Link from "next/link";
import { Plus } from "lucide-react";
import { featuredProducts, formatToman } from "@/lib/products";
import { SunburstMark } from "@/components/icons";

export default function FeaturedProducts() {
  return (
    <section className="bg-paper-deep/60">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            پرفروش‌های این هفته
          </h2>
          <Link
            href="/shop"
            className="hidden sm:inline text-sm text-coffee hover:text-coffee-deep transition-colors shrink-0"
          >
            مشاهده همه ←
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <article
              key={product.slug}
              className="group rounded-2xl bg-cream border border-line overflow-hidden"
            >
              <Link
                href={`/shop/${product.slug}`}
                className="block aspect-square bg-ink flex items-center justify-center relative overflow-hidden"
              >
                <SunburstMark className="h-24 w-24 text-cream/90 transition-transform duration-300 group-hover:scale-105" />
              </Link>
              <div className="p-5">
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-bold text-ink hover:text-coffee transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-1 text-xs text-ink-soft">
                  {product.origin} · {product.weight}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">
                    {formatToman(product.price)}
                  </span>
                  <button
                    aria-label={`افزودن ${product.name} به سبد خرید`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream hover:bg-coffee-deep transition-colors"
                  >
                    <Plus size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
