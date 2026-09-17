import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticleBySlug, listPublishedArticles } from "@/server/repo/articles";

export function generateStaticParams() { return listPublishedArticles().map(a=>({slug:a.slug})); }

export default async function ArticlePage({ params }: { params: Promise<{slug:string}> }) {
  const {slug}=await params; const article=getArticleBySlug(slug);
  if(!article || !article.published) notFound();
  return <><Header/><main className="flex-1"><article className="mx-auto max-w-3xl px-4 py-10 md:py-16">
    <Link href="/journal" className="text-sm text-coffee">← بازگشت به مجله</Link>
    <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-coffee">MEHRDAD JOURNAL</p>
    <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight text-ink">{article.title}</h1>
    {article.excerpt && <p className="mt-5 text-lg leading-8 text-ink-soft">{article.excerpt}</p>}
    {article.coverImageUrl && <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl"><Image src={article.coverImageUrl} alt="" fill className="object-cover"/></div>}
    <div className="mt-10 whitespace-pre-line text-[15px] leading-9 text-ink">{article.content}</div>
  </article></main><Footer/></>;
}
