import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SunburstMark } from "@/components/icons";
import { listPublishedArticles } from "@/server/repo/articles";

export const metadata = { title: "مجله قهوه | قهوه مهرداد" };

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(iso.replace(" ", "T") + "Z")
  );
}

export default function JournalPage() {
  const articles = listPublishedArticles();

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
                    <p className="text-xs text-ink-soft" dir="ltr">
                      {formatDate(a.createdAt)}
                    </p>
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
            <p className="text-center text-ink-soft py-20">هنوز مقاله‌ای منتشر نشده است.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
