import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft, Package, RotateCcw, Star, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { SunburstMark } from "@/components/icons";
import VariantSelector from "@/components/shop/VariantSelector";
import Accordion from "@/components/shop/Accordion";
import ReviewForm from "@/components/shop/ReviewForm";
import {
  getProductBySlug,
  getRelatedProducts,
  listProducts,
} from "@/server/repo/products";
import { getCategoryById } from "@/server/repo/categories";
import {
  listApprovedReviewsForProduct,
  hasCustomerReviewedProduct,
} from "@/server/repo/reviews";
import { hasCustomerPurchasedProduct } from "@/server/repo/customers";
import { getCurrentCustomer } from "@/server/auth/customer";
import { brewingTips, weightLabel } from "@/lib/products";

export function generateStaticParams() {
  return listProducts({ onlyPublished: true }).map((p) => ({ slug: p.slug }));
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
    description: `${product.name} از ${product.origin}. خرید آنلاین از قهوه مهرداد.`,
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

  const category = getCategoryById(product.categoryId);
  const related = getRelatedProducts(product);
  const reviews = listApprovedReviewsForProduct(product.id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  const customer = await getCurrentCustomer();
  let reviewStatus:
    "can-review" | "not-logged-in" | "not-purchased" | "already-reviewed" =
    "not-logged-in";
  if (customer) {
    if (hasCustomerReviewedProduct(customer.id, product.id)) {
      reviewStatus = "already-reviewed";
    } else if (hasCustomerPurchasedProduct(customer.id, product.id)) {
      reviewStatus = "can-review";
    } else {
      reviewStatus = "not-purchased";
    }
  }

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
          <div className="relative rounded-2xl bg-ink flex items-center justify-center aspect-square overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <SunburstMark className="h-40 w-40 text-cream/90" />
            )}
          </div>

          {/* buy box */}
          <div className="flex flex-col">
            {category && (
              <Link
                href={`/shop?category=${category.slug}`}
                className="text-sm text-coffee hover:text-coffee-deep transition-colors w-fit"
              >
                {category.title}
              </Link>
            )}
            <h1 className="mt-2 text-3xl font-extrabold text-ink">
              {product.name}
            </h1>
            <p className="mt-2 text-ink-soft">خاستگاه: {product.origin}</p>

            {avgRating !== null && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-ink-soft">
                <Star size={16} className="fill-brass text-brass" />
                <span className="text-ink font-medium">
                  {avgRating.toFixed(1)}
                </span>
                <span>({reviews.length} نظر)</span>
              </div>
            )}

            <p className="mt-5 text-sm leading-7 text-ink-soft">
              {product.description ||
                `${product.name} با دانه‌های ${product.origin} تهیه و در اصفهان تازه برشته می‌شود.`}
            </p>

            <div className="mt-7">
              <VariantSelector
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                }}
                variants={product.variants}
                requiresGrind={category?.requiresGrind ?? false}
              />
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
                        <li>دسته‌بندی: {category?.title ?? "-"}</li>
                        <li>خاستگاه: {product.origin}</li>
                        <li>
                          وزن‌های موجود:{" "}
                          {Array.from(
                            new Set(product.variants.map((v) => v.weight))
                          )
                            .map((w) => weightLabel(w))
                            .join("، ")}
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: "نحوه‌ی دم‌آوری پیشنهادی",
                    content: (
                      <p>{category ? brewingTips[category.slug] : ""}</p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* reviews */}
        <section className="mx-auto max-w-6xl px-4 py-14 border-t border-line">
          <h2 className="text-2xl font-extrabold text-ink">نظرات مشتریان</h2>

          {reviews.length > 0 ? (
            <ul className="mt-6 space-y-5">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-2xl border border-line bg-cream p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">
                      {review.customerName || "مشتری مهرداد"}
                    </span>
                    <div className="flex items-center gap-0.5" dir="ltr">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-brass text-brass"
                              : "text-line"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">
              هنوز نظری برای این محصول ثبت نشده است.
            </p>
          )}

          <div className="mt-8 rounded-2xl border border-line bg-paper-deep/40 p-5">
            <h3 className="font-bold text-ink mb-3">ثبت نظر شما</h3>
            <ReviewForm productId={product.id} status={reviewStatus} />
          </div>
        </section>

        {/* related products */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-extrabold text-ink">محصولات مشابه</h2>
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
