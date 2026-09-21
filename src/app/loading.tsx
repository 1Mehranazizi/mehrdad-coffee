// Shown while any page without its own loading.tsx is rendering on the server.
export default function RootLoading() {
  return (
    <div aria-busy="true" aria-label="در حال بارگذاری" className="flex-1">
      <div className="border-b border-line bg-paper-deep/60">
        <div className="mx-auto max-w-6xl px-4 py-14 space-y-3">
          <div className="h-8 w-56 animate-pulse rounded-full bg-paper-deep" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-paper-deep" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl border border-line bg-cream" />
        ))}
      </div>
    </div>
  );
}
