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

type SearchParams = Promise<{ category?: string; search?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, search } = await searchParams;

  const categories = listCategories();
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const products = listProducts({ onlyPublished: true, search }).map((p) => ({
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
          <div className="mx-auto max-w-6xl px-4 py-12 text-center md:text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-coffee">MEHRDAD COFFEE</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink">فروشگاه مهرداد</h1>
            <p className="mt-2 text-ink-soft">{search ? `نتایج جستجو برای «${search}»` : "قهوه، نسکافه، هات چاکلت و چای ماسالا؛ تازه و آماده ارسال."}</p>
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
