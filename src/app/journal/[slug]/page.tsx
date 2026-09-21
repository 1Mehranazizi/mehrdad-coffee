import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SunburstMark } from "@/components/icons";
import { getArticleBySlug } from "@/server/repo/articles";
import { formatDate } from "@/lib/format-date";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: `${article.title} | مجله قهوه مهرداد`, description: article.excerpt ?? undefined };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !article.published) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 pt-6">
          <nav className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Link href="/" className="hover:text-coffee transition-colors">خانه</Link>
            <ChevronLeft size={14} />
            <Link href="/journal" className="hover:text-coffee transition-colors">مجله قهوه</Link>
            <ChevronLeft size={14} />
            <span className="text-ink">{article.title}</span>
          </nav>
        </div>

        <article className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-xs text-ink-soft">{formatDate(article.createdAt)}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink">{article.title}</h1>

          <div className="relative mt-6 aspect-[16/9] rounded-2xl bg-ink flex items-center justify-center overflow-hidden">
            {article.coverImageUrl ? (
              <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
            ) : (
              <SunburstMark className="h-20 w-20 text-cream/90" />
            )}
          </div>

          <div className="mt-8 space-y-4 text-[15px] leading-8 text-ink-soft whitespace-pre-line">
            {article.content}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
