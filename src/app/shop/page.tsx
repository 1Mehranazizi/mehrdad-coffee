import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopClient from "@/components/shop/ShopClient";
import { listProducts, getPriceRange } from "@/server/repo/products";
import { listCategories } from "@/server/repo/categories";

export const metadata = {
  title: "فروشگاه | قهوه مهرداد",
  description:
    "خرید دان و پودر قهوه تازه برشته‌شده مهرداد؛ اسپرسو، فیلتر، ترک و دان کامل.",
};

type SearchParams = Promise<{ category?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;

  const categories = listCategories();
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const products = listProducts({ onlyPublished: true }).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    origin: p.origin,
    price: p.price,
    weight: p.weight,
    imageUrl: p.imageUrl,
    categorySlug: categoryById.get(p.categoryId)?.slug ?? "",
  }));
  const priceRange = getPriceRange();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-line bg-paper-deep/60">
          <div className="mx-auto max-w-6xl px-4 py-10 text-center md:text-right">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">
              فروشگاه قهوه مهرداد
            </h1>
            <p className="mt-2 text-ink-soft">
              دان و پودر قهوه، تازه برشته‌شده و آماده ارسال.
            </p>
          </div>
        </div>
        <ShopClient
          products={products}
          categories={categories}
          priceMin={priceRange.min}
          priceMax={priceRange.max}
          initialCategory={category}
        />
      </main>
      <Footer />
    </>
  );
}
