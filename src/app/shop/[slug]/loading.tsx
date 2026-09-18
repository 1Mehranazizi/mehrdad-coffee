export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-10">
      <div className="aspect-square rounded-2xl bg-cream border border-line animate-pulse" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded-full bg-cream border border-line animate-pulse" />
        <div className="h-8 w-2/3 rounded-full bg-cream border border-line animate-pulse" />
        <div className="h-4 w-1/2 rounded-full bg-cream border border-line animate-pulse" />
        <div className="h-24 w-full rounded-2xl bg-cream border border-line animate-pulse" />
        <div className="h-12 w-full rounded-full bg-cream border border-line animate-pulse" />
      </div>
    </div>
  );
}
