import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  published: boolean;
  createdAt: string;
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: number;
  created_at: string;
};

function mapRow(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    published: Boolean(row.published),
    createdAt: row.created_at,
  };
}

export function listPublishedArticles(): Article[] {
  const rows = db
    .prepare("SELECT * FROM articles WHERE published = 1 ORDER BY created_at DESC")
    .all() as ArticleRow[];
  return rows.map(mapRow);
}

export function listAllArticlesForAdmin(): Article[] {
  const rows = db
    .prepare("SELECT * FROM articles ORDER BY created_at DESC")
    .all() as ArticleRow[];
  return rows.map(mapRow);
}

export function getArticleBySlug(slug: string): Article | undefined {
  const row = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug) as
    | ArticleRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function getArticleById(id: string): Article | undefined {
  const row = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as
    | ArticleRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function createArticle(input: {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  published: boolean;
}): Article {
  const id = newId("art");
  db.prepare(
    `INSERT INTO articles (id, slug, title, excerpt, content, cover_image_url, published)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.slug,
    input.title,
    input.excerpt ?? null,
    input.content,
    input.coverImageUrl ?? null,
    input.published ? 1 : 0
  );
  return getArticleById(id)!;
}

export function updateArticle(
  id: string,
  input: {
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    coverImageUrl?: string | null;
    published: boolean;
  }
): void {
  db.prepare(
    `UPDATE articles SET slug = ?, title = ?, excerpt = ?, content = ?, cover_image_url = ?, published = ?
     WHERE id = ?`
  ).run(
    input.slug,
    input.title,
    input.excerpt ?? null,
    input.content,
    input.coverImageUrl ?? null,
    input.published ? 1 : 0,
    id
  );
}

export function deleteArticle(id: string): void {
  db.prepare("DELETE FROM articles WHERE id = ?").run(id);
}
