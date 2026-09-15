import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { getArticleById, updateArticle, deleteArticle } from "@/server/repo/articles";
import { saveUploadedImage } from "@/server/uploads";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  const existing = getArticleById(id);
  if (!existing) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "");
  const content = String(form.get("content") ?? "").trim();
  const published = form.get("published") === "true";
  const image = form.get("coverImage");

  if (!slug || !title || !content) {
    return NextResponse.json({ error: "عنوان، اسلاگ و متن الزامی است" }, { status: 400 });
  }

  let coverImageUrl = existing.coverImageUrl;
  if (image instanceof File && image.size > 0) {
    const uploaded = await saveUploadedImage(image);
    if (uploaded.error) return NextResponse.json({ error: uploaded.error }, { status: 400 });
    coverImageUrl = uploaded.url ?? null;
  }

  updateArticle(id, { slug, title, excerpt, content, published, coverImageUrl });
  return NextResponse.json({ article: getArticleById(id) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  deleteArticle(id);
  return NextResponse.json({ ok: true });
}
