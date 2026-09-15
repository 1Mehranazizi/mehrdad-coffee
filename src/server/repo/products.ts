import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type Product = {
  id: string;
  slug: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  imageUrl: string | null;
  description: string | null;
  published: boolean;
  categoryId: string;
  createdAt: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  image_url: string | null;
  description: string | null;
  published: number;
  category_id: string;
  created_at: string;
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    origin: row.origin,
    price: row.price,
    weight: row.weight,
    imageUrl: row.image_url,
    description: row.description,
    published: Boolean(row.published),
    categoryId: row.category_id,
    createdAt: row.created_at,
  };
}

export type ProductFilters = {
  categorySlugs?: string[];
  weights?: string[];
  maxPrice?: number;
  sort?: "default" | "price-asc" | "price-desc" | "name";
  onlyPublished?: boolean;
};

export function listProducts(filters: ProductFilters = {}): Product[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.onlyPublished !== false) {
    conditions.push("p.published = 1");
  }

  if (filters.categorySlugs && filters.categorySlugs.length > 0) {
    conditions.push(
      `c.slug IN (${filters.categorySlugs.map(() => "?").join(",")})`
    );
    params.push(...filters.categorySlugs);
  }

  if (filters.weights && filters.weights.length > 0) {
    conditions.push(`p.weight IN (${filters.weights.map(() => "?").join(",")})`);
    params.push(...filters.weights);
  }

  if (typeof filters.maxPrice === "number") {
    conditions.push("p.price <= ?");
    params.push(filters.maxPrice);
  }

  let orderBy = "p.created_at DESC";
  if (filters.sort === "price-asc") orderBy = "p.price ASC";
  else if (filters.sort === "price-desc") orderBy = "p.price DESC";
  else if (filters.sort === "name") orderBy = "p.name ASC";

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT p.* FROM products p JOIN categories c ON c.id = p.category_id ${where} ORDER BY ${orderBy}`
    )
    .all(...params) as ProductRow[];

  return rows.map(mapRow);
}

export function getAllProductsForAdmin(): Product[] {
  const rows = db
    .prepare("SELECT * FROM products ORDER BY created_at DESC")
    .all() as ProductRow[];
  return rows.map(mapRow);
}

export function getProductBySlug(slug: string): Product | undefined {
  const row = db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .get(slug) as ProductRow | undefined;
  return row ? mapRow(row) : undefined;
}

export function getProductById(id: string): Product | undefined {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const rows = db
    .prepare(
      "SELECT * FROM products WHERE category_id = ? AND id != ? AND published = 1 ORDER BY created_at DESC LIMIT ?"
    )
    .all(product.categoryId, product.id, limit) as ProductRow[];
  return rows.map(mapRow);
}

export function getFeaturedProducts(limit = 4): Product[] {
  const rows = db
    .prepare(
      "SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC LIMIT ?"
    )
    .all(limit) as ProductRow[];
  return rows.map(mapRow);
}

export function getPriceRange(): { min: number; max: number } {
  const row = db
    .prepare("SELECT MIN(price) as min, MAX(price) as max FROM products")
    .get() as { min: number | null; max: number | null };
  return { min: row.min ?? 0, max: row.max ?? 0 };
}

export function createProduct(input: {
  slug: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  imageUrl?: string;
  description?: string;
  published: boolean;
  categoryId: string;
}): Product {
  const id = newId("prod");
  db.prepare(
    `INSERT INTO products (id, slug, name, origin, price, weight, image_url, description, published, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.slug,
    input.name,
    input.origin,
    input.price,
    input.weight,
    input.imageUrl ?? null,
    input.description ?? null,
    input.published ? 1 : 0,
    input.categoryId
  );
  return getProductById(id)!;
}

export function updateProduct(
  id: string,
  input: {
    slug: string;
    name: string;
    origin: string;
    price: number;
    weight: string;
    imageUrl?: string | null;
    description?: string;
    published: boolean;
    categoryId: string;
  }
): void {
  db.prepare(
    `UPDATE products SET slug = ?, name = ?, origin = ?, price = ?, weight = ?, image_url = ?, description = ?, published = ?, category_id = ?
     WHERE id = ?`
  ).run(
    input.slug,
    input.name,
    input.origin,
    input.price,
    input.weight,
    input.imageUrl ?? null,
    input.description ?? null,
    input.published ? 1 : 0,
    input.categoryId,
    id
  );
}

export function deleteProduct(id: string): void {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}
