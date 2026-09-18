export default function JournalLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-line bg-cream overflow-hidden">
          <div className="aspect-[16/10] animate-pulse bg-paper-deep" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-1/3 rounded-full animate-pulse bg-paper-deep" />
            <div className="h-4 w-3/4 rounded-full animate-pulse bg-paper-deep" />
            <div className="h-3 w-full rounded-full animate-pulse bg-paper-deep" />
          </div>
        </div>
      ))}
    </div>
  );
}
