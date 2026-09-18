import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  requiresGrind: boolean;
};

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  requires_grind: number;
};

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    requiresGrind: Boolean(row.requires_grind),
  };
}

export function listCategories(): Category[] {
  const rows = db.prepare("SELECT * FROM categories ORDER BY title ASC").all() as CategoryRow[];
  return rows.map(mapRow);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const row = db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as
    | CategoryRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function getCategoryById(id: string): Category | undefined {
  const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as
    | CategoryRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function createCategory(input: {
  slug: string;
  title: string;
  description?: string;
  requiresGrind?: boolean;
}): Category {
  const id = newId("cat");
  db.prepare(
    "INSERT INTO categories (id, slug, title, description, requires_grind) VALUES (?, ?, ?, ?, ?)"
  ).run(id, input.slug, input.title, input.description ?? null, input.requiresGrind ? 1 : 0);
  return getCategoryById(id)!;
}

export function updateCategory(
  id: string,
  input: { slug: string; title: string; description?: string; requiresGrind?: boolean }
): void {
  db.prepare(
    "UPDATE categories SET slug = ?, title = ?, description = ?, requires_grind = ? WHERE id = ?"
  ).run(input.slug, input.title, input.description ?? null, input.requiresGrind ? 1 : 0, id);
}

export function deleteCategory(id: string): void {
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}
