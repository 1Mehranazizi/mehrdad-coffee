import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Package, RotateCcw, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { SunburstMark } from "@/components/icons";
import AddToCartBox from "@/components/shop/AddToCartBox";
import Accordion from "@/components/shop/Accordion";
import {
  products,
  getProductBySlug,
  getRelatedProducts,
  categoryTitle,
  weightLabel,
  formatToman,
  brewingTips,
} from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | قهوه مهرداد`,
    description: `${product.name} از ${product.origin} — ${weightLabel(product.weight)}. خرید آنلاین قهوه تازه برشته‌شده مهرداد.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <nav className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Link href="/" className="hover:text-coffee transition-colors">
              خانه
            </Link>
            <ChevronLeft size={14} />
            <Link href="/shop" className="hover:text-coffee transition-colors">
              فروشگاه
            </Link>
            <ChevronLeft size={14} />
            <span className="text-ink">{product.name}</span>
          </nav>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-10">
          {/* gallery */}
          <div className="rounded-2xl bg-ink flex items-center justify-center aspect-square">
            <SunburstMark className="h-40 w-40 text-cream/90" />
          </div>

          {/* buy box */}
          <div className="flex flex-col">
            <Link
              href={`/shop?category=${product.category}`}
              className="text-sm text-coffee hover:text-coffee-deep transition-colors w-fit"
            >
              {categoryTitle(product.category)}
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-ink">
              {product.name}
            </h1>
            <p className="mt-2 text-ink-soft">
              خاستگاه: {product.origin} · وزن: {weightLabel(product.weight)}
            </p>

            <p className="mt-6 text-3xl font-bold text-ink">
              {formatToman(product.price)}
            </p>

            <p className="mt-5 text-sm leading-7 text-ink-soft">
              {product.name} با دانه‌های {product.origin} تهیه و در اصفهان
              تازه برشته می‌شود. بسته‌بندی وکیوم با دریچه‌ی یک‌طرفه، عطر و
              طراوت قهوه را تا هفته‌ها حفظ می‌کند.
            </p>

            <div className="mt-7">
              <AddToCartBox />
            </div>

            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-soft">
              <li className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5">
                <Truck size={16} strokeWidth={1.75} className="shrink-0" />
                ارسال به سراسر ایران
              </li>
              <li className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5">
                <Package size={16} strokeWidth={1.75} className="shrink-0" />
                بسته‌بندی وکیوم تازه
              </li>
              <li className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5">
                <RotateCcw size={16} strokeWidth={1.75} className="shrink-0" />
                ضمانت بازگشت کالا
              </li>
            </ul>

            <div className="mt-8">
              <Accordion
                items={[
                  {
                    title: "مشخصات محصول",
                    content: (
                      <ul className="space-y-1.5">
                        <li>دسته‌بندی: {categoryTitle(product.category)}</li>
                        <li>خاستگاه: {product.origin}</li>
                        <li>وزن: {weightLabel(product.weight)}</li>
                      </ul>
                    ),
                  },
                  {
                    title: "نحوه‌ی دم‌آوری پیشنهادی",
                    content: <p>{brewingTips[product.category]}</p>,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* related products */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-extrabold text-ink">
              محصولات مشابه
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
