import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { SunburstMark } from "@/components/icons";
import { queryPublishedArticles } from "@/server/repo/articles";
import { formatDate } from "@/lib/format-date";
import { firstParam } from "@/lib/pagination";

export const metadata = { title: "مجله قهوه | قهوه مهرداد" };

const PAGE_SIZE = 9;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function JournalPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const pageNum = Math.floor(Number(firstParam(sp.page)));
  const requestedPage = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const { items: articles, ...paging } = queryPublishedArticles({
    q,
    page: requestedPage,
    perPage: PAGE_SIZE,
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-line bg-paper-deep/60">
          <div className="mx-auto max-w-6xl px-4 py-10 text-center md:text-right">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">مجله قهوه</h1>
            <p className="mt-2 text-ink-soft">
              نکته‌ها، داستان‌ها و راهنماهایی درباره‌ی قهوه و دم‌آوری آن.
            </p>

            <form action="/journal" className="relative mt-6 mx-auto md:mx-0 max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="جستجو در مقالات…"
                aria-label="جستجو در مقالات"
                className="w-full rounded-full border border-line bg-cream py-2.5 pr-11 pl-4 text-sm text-ink placeholder:text-ink-soft/70 focus:border-coffee"
              />
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12">
          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/journal/${a.slug}`}
                  className="group block rounded-2xl border border-line bg-cream overflow-hidden hover:border-coffee transition-colors"
                >
                  <div className="relative aspect-[16/10] bg-ink flex items-center justify-center overflow-hidden">
                    {a.coverImageUrl ? (
                      <Image
                        src={a.coverImageUrl}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <SunburstMark className="h-16 w-16 text-cream/90" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-ink-soft">{formatDate(a.createdAt)}</p>
                    <h2 className="mt-1.5 font-bold text-ink group-hover:text-coffee transition-colors">
                      {a.title}
                    </h2>
                    {a.excerpt && (
                      <p className="mt-2 text-sm text-ink-soft leading-6 line-clamp-2">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-ink-soft">
              <p>{q ? "مقاله‌ای با این جستجو پیدا نشد." : "هنوز مقاله‌ای منتشر نشده است."}</p>
              {q && (
                <Link href="/journal" className="mt-4 inline-block text-sm text-coffee hover:text-coffee-deep">
                  نمایش همه مقالات
                </Link>
              )}
            </div>
          )}

          <Pagination
            basePath="/journal"
            params={q ? { q } : {}}
            page={paging.page}
            perPage={PAGE_SIZE}
            total={paging.total}
            totalPages={paging.totalPages}
            defaultPerPage={PAGE_SIZE}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
