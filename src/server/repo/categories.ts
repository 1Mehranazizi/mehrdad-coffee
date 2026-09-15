import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
};

export function listCategories(): Category[] {
  return db.prepare("SELECT * FROM categories ORDER BY title ASC").all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as
    | Category
    | undefined;
}

export function getCategoryById(id: string): Category | undefined {
  return db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as
    | Category
    | undefined;
}

export function createCategory(input: {
  slug: string;
  title: string;
  description?: string;
}): Category {
  const id = newId("cat");
  db.prepare(
    "INSERT INTO categories (id, slug, title, description) VALUES (?, ?, ?, ?)"
  ).run(id, input.slug, input.title, input.description ?? null);
  return getCategoryById(id)!;
}

export function updateCategory(
  id: string,
  input: { slug: string; title: string; description?: string }
): void {
  db.prepare(
    "UPDATE categories SET slug = ?, title = ?, description = ? WHERE id = ?"
  ).run(input.slug, input.title, input.description ?? null, id);
}

export function deleteCategory(id: string): void {
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}
