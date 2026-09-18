import ProductCardSkeleton from "@/components/shop/ProductCardSkeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid md:grid-cols-[260px_1fr] gap-8">
      <div className="hidden md:block h-96 rounded-2xl bg-cream border border-line animate-pulse" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
