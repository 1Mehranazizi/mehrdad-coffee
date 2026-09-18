import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/server/repo/products";

export const metadata = { title: "نتایج جستجو | قهوه مهرداد" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q.trim().length >= 2 ? searchProducts(q.trim(), 30) : [];

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-10 md:py-14">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
          نتایج جستجو برای «{q}»
        </h1>
        <p className="mt-2 text-sm text-ink-soft">{products.length} محصول پیدا شد</p>

        {products.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line py-20 text-center text-ink-soft">
            محصولی با این عبارت پیدا نشد.
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
