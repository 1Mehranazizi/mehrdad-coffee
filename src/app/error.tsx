"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCcw, Coffee } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="min-h-screen bg-paper flex items-center justify-center px-4"><div className="max-w-md text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-ink text-cream"><Coffee size={34}/></div><p className="mt-7 text-xs font-semibold tracking-[0.25em] text-coffee">MEHRDAD COFFEE</p><h1 className="mt-2 text-3xl font-extrabold text-ink">مشکلی پیش آمد</h1><p className="mt-3 text-ink-soft leading-7">یک خطای غیرمنتظره رخ داد. دوباره تلاش کنید.</p><div className="mt-7 flex justify-center gap-2"><button onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"><RefreshCcw size={17}/> تلاش دوباره</button><Link href="/" className="rounded-full border border-line bg-cream px-6 py-3 text-sm font-semibold text-ink">خانه</Link></div></div></main>;
}
