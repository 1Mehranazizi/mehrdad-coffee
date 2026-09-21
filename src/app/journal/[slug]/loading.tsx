export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <div className="h-3 w-24 animate-pulse rounded-full bg-paper-deep" />
      <div className="h-9 w-3/4 animate-pulse rounded-full bg-paper-deep" />
      <div className="aspect-[16/9] animate-pulse rounded-2xl bg-paper-deep" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 w-full animate-pulse rounded-full bg-paper-deep" />
        ))}
      </div>
    </div>
  );
}
