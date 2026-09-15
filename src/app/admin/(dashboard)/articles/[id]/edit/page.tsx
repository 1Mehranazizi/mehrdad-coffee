import { notFound } from "next/navigation";
import { getArticleById } from "@/server/repo/articles";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">ویرایش مقاله</h1>
      <ArticleForm initial={article} />
    </div>
  );
}
