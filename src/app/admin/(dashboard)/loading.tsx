export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="در حال بارگذاری">
      <div className="mb-6 h-8 w-40 animate-pulse rounded-full bg-paper-deep" />
      <div className="mb-4 h-11 w-full animate-pulse rounded-full bg-paper-deep" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl border border-line bg-cream" />
        ))}
      </div>
    </div>
  );
}
