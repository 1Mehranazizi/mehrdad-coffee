import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";
import { buildPaged, likePattern, type Paged } from "@/lib/pagination";

export type ProductVariant = {
  id: string;
  productId: string;
  weight: string;
  grindTypeId: string | null;
  grindTypeName: string | null;
  price: number;
};

type VariantRow = {
  id: string;
  product_id: string;
  weight: string;
  grind_type_id: string | null;
  price: number;
  grind_type_name: string | null;
};

function mapVariant(row: VariantRow): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    weight: row.weight,
    grindTypeId: row.grind_type_id,
    grindTypeName: row.grind_type_name,
    price: row.price,
  };
}

export function getVariantsForProduct(productId: string): ProductVariant[] {
  const rows = db
    .prepare(
      `SELECT v.*, g.title as grind_type_name FROM product_variants v
       LEFT JOIN grind_types g ON g.id = v.grind_type_id
       WHERE v.product_id = ?
       ORDER BY v.price ASC`
    )
    .all(productId) as VariantRow[];
  return rows.map(mapVariant);
}

export function getVariantById(id: string): ProductVariant | undefined {
  const row = db
    .prepare(
      `SELECT v.*, g.title as grind_type_name FROM product_variants v
       LEFT JOIN grind_types g ON g.id = v.grind_type_id
       WHERE v.id = ?`
    )
    .get(id) as VariantRow | undefined;
  return row ? mapVariant(row) : undefined;
}

function replaceVariants(
  productId: string,
  variants: { weight: string; grindTypeId?: string | null; price: number }[]
) {
  db.prepare("DELETE FROM product_variants WHERE product_id = ?").run(productId);
  const insert = db.prepare(
    "INSERT INTO product_variants (id, product_id, weight, grind_type_id, price) VALUES (?, ?, ?, ?, ?)"
  );
  for (const v of variants) {
    insert.run(newId("var"), productId, v.weight, v.grindTypeId ?? null, v.price);
  }
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  origin: string;
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
    imageUrl: row.image_url,
    description: row.description,
    published: Boolean(row.published),
    categoryId: row.category_id,
    createdAt: row.created_at,
  };
}

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
  minPrice: number;
};

function withVariants(product: Product): ProductWithVariants {
  const variants = getVariantsForProduct(product.id);
  const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;
  return { ...product, variants, minPrice };
}

export type ProductFilters = {
  categorySlugs?: string[];
  weights?: string[];
  maxPrice?: number;
  sort?: "default" | "price-asc" | "price-desc" | "name";
  onlyPublished?: boolean;
};

export function listProducts(filters: ProductFilters = {}): ProductWithVariants[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.onlyPublished !== false) conditions.push("p.published = 1");

  if (filters.categorySlugs && filters.categorySlugs.length > 0) {
    conditions.push(`c.slug IN (${filters.categorySlugs.map(() => "?").join(",")})`);
    params.push(...filters.categorySlugs);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db
    .prepare(
      `SELECT p.* FROM products p JOIN categories c ON c.id = p.category_id ${where} ORDER BY p.created_at DESC`
    )
    .all(...params) as ProductRow[];

  let products = rows.map((row) => withVariants(mapRow(row)));

  if (filters.weights && filters.weights.length > 0) {
    products = products.filter((p) => p.variants.some((v) => filters.weights!.includes(v.weight)));
  }
  if (typeof filters.maxPrice === "number") {
    products = products.filter((p) => p.minPrice <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case "price-asc":
      products.sort((a, b) => a.minPrice - b.minPrice);
      break;
    case "price-desc":
      products.sort((a, b) => b.minPrice - a.minPrice);
      break;
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name, "fa"));
      break;
  }

  return products;
}

export function getAllProductsForAdmin(): ProductWithVariants[] {
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as ProductRow[];
  return rows.map((row) => withVariants(mapRow(row)));
}

export function queryProductsForAdmin(filters: {
  q?: string;
  categoryId?: string;
  status?: "published" | "draft";
  page: number;
  perPage: number;
}): Paged<ProductWithVariants> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.q) {
    conditions.push("(p.name LIKE ? ESCAPE '\\' OR p.origin LIKE ? ESCAPE '\\' OR p.slug LIKE ? ESCAPE '\\')");
    const like = likePattern(filters.q);
    params.push(like, like, like);
  }
  if (filters.categoryId) {
    conditions.push("p.category_id = ?");
    params.push(filters.categoryId);
  }
  if (filters.status) {
    conditions.push("p.published = ?");
    params.push(filters.status === "published" ? 1 : 0);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { total } = db
    .prepare(`SELECT COUNT(*) as total FROM products p ${where}`)
    .get(...params) as { total: number };
  const paged = buildPaged<ProductWithVariants>([], total, filters.page, filters.perPage);

  const rows = db
    .prepare(
      `SELECT p.* FROM products p ${where} ORDER BY p.created_at DESC, p.rowid DESC LIMIT ? OFFSET ?`
    )
    .all(...params, filters.perPage, (paged.page - 1) * filters.perPage) as ProductRow[];
  paged.items = rows.map((row) => withVariants(mapRow(row)));
  return paged;
}

export function countProducts(): number {
  return (db.prepare("SELECT COUNT(*) as n FROM products").get() as { n: number }).n;
}

export function getProductBySlug(slug: string): ProductWithVariants | undefined {
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as
    | ProductRow
    | undefined;
  return row ? withVariants(mapRow(row)) : undefined;
}

export function getProductById(id: string): ProductWithVariants | undefined {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  return row ? withVariants(mapRow(row)) : undefined;
}

export function getRelatedProducts(product: Product, limit = 4): ProductWithVariants[] {
  const rows = db
    .prepare(
      "SELECT * FROM products WHERE category_id = ? AND id != ? AND published = 1 ORDER BY created_at DESC LIMIT ?"
    )
    .all(product.categoryId, product.id, limit) as ProductRow[];
  return rows.map((row) => withVariants(mapRow(row)));
}

export function getFeaturedProducts(limit = 4): ProductWithVariants[] {
  const rows = db
    .prepare("SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC LIMIT ?")
    .all(limit) as ProductRow[];
  return rows.map((row) => withVariants(mapRow(row)));
}

export function getPriceRange(): { min: number; max: number } {
  const row = db
    .prepare("SELECT MIN(price) as min, MAX(price) as max FROM product_variants")
    .get() as { min: number | null; max: number | null };
  return { min: row.min ?? 0, max: row.max ?? 0 };
}

export function searchProducts(query: string, limit = 8): ProductWithVariants[] {
  const like = `%${query}%`;
  const rows = db
    .prepare(
      `SELECT * FROM products WHERE published = 1 AND (name LIKE ? OR origin LIKE ?) ORDER BY created_at DESC LIMIT ?`
    )
    .all(like, like, limit) as ProductRow[];
  return rows.map((row) => withVariants(mapRow(row)));
}

export function createProduct(input: {
  slug: string;
  name: string;
  origin: string;
  imageUrl?: string;
  description?: string;
  published: boolean;
  categoryId: string;
  variants: { weight: string; grindTypeId?: string | null; price: number }[];
}): ProductWithVariants {
  const id = newId("prod");
  db.prepare(
    `INSERT INTO products (id, slug, name, origin, image_url, description, published, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.slug,
    input.name,
    input.origin,
    input.imageUrl ?? null,
    input.description ?? null,
    input.published ? 1 : 0,
    input.categoryId
  );
  replaceVariants(id, input.variants);
  return getProductById(id)!;
}

export function updateProduct(
  id: string,
  input: {
    slug: string;
    name: string;
    origin: string;
    imageUrl?: string | null;
    description?: string;
    published: boolean;
    categoryId: string;
    variants: { weight: string; grindTypeId?: string | null; price: number }[];
  }
): void {
  db.prepare(
    `UPDATE products SET slug = ?, name = ?, origin = ?, image_url = ?, description = ?, published = ?, category_id = ?
     WHERE id = ?`
  ).run(
    input.slug,
    input.name,
    input.origin,
    input.imageUrl ?? null,
    input.description ?? null,
    input.published ? 1 : 0,
    input.categoryId,
    id
  );
  replaceVariants(id, input.variants);
}

export function deleteProduct(id: string): void {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}
