import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listPublishedArticles } from "@/server/repo/articles";

export const metadata = { title: "مجله قهوه | قهوه مهرداد", description: "مقالات آموزشی و دانستنی‌های قهوه مهرداد." };

export default function JournalPage() {
  const articles = listPublishedArticles();
  return <>
    <Header />
    <main className="flex-1">
      <section className="border-b border-line bg-paper-deep/60"><div className="mx-auto max-w-6xl px-4 py-14"><p className="text-xs font-semibold tracking-[0.2em] text-coffee">MEHRDAD JOURNAL</p><h1 className="mt-2 text-4xl font-extrabold text-ink">مجله قهوه</h1><p className="mt-3 max-w-2xl text-ink-soft leading-7">راهنمای دم‌آوری، شناخت قهوه و نکته‌های کاربردی برای یک فنجان بهتر.</p></div></section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        {articles.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map(a=><article key={a.id} className="group overflow-hidden rounded-3xl border border-line bg-cream"><Link href={`/journal/${a.slug}`} className="block">{a.coverImageUrl ? <div className="relative aspect-[16/10]"><Image src={a.coverImageUrl} alt="" fill className="object-cover transition duration-500 group-hover:scale-105"/></div> : <div className="aspect-[16/10] bg-ink flex items-center justify-center"><span className="text-cream text-3xl font-extrabold">MJ</span></div>}<div className="p-5"><p className="text-xs text-coffee">مجله مهرداد</p><h2 className="mt-2 text-lg font-bold text-ink group-hover:text-coffee">{a.title}</h2>{a.excerpt && <p className="mt-2 text-sm leading-7 text-ink-soft line-clamp-3">{a.excerpt}</p>}<span className="mt-4 inline-block text-sm font-semibold text-ink">مطالعه مقاله ←</span></div></Link></article>)}</div> : <div className="rounded-3xl border border-dashed border-line p-16 text-center text-ink-soft">به‌زودی مقالات جدید منتشر می‌شوند.</div>}
      </section>
    </main><Footer/>
  </>;
}
