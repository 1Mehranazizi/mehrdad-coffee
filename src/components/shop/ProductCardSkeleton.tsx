export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-cream overflow-hidden w-full">
      <div className="aspect-square animate-pulse bg-paper-deep" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded-full animate-pulse bg-paper-deep" />
        <div className="h-3 w-1/2 rounded-full animate-pulse bg-paper-deep" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-20 rounded-full animate-pulse bg-paper-deep" />
          <div className="h-9 w-9 rounded-full animate-pulse bg-paper-deep" />
        </div>
      </div>
    </div>
  );
}
