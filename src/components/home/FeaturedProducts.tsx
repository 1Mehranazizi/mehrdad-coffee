import Link from "next/link";
import { getFeaturedProducts } from "@/server/repo/products";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts(4);

  if (featuredProducts.length === 0) return null;

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
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
