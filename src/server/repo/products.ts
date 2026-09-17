import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type ProductVariant = {
  id: string;
  productId: string;
  weight: string;
  grindOptionId: string | null;
  grind: string | null;
  price: number;
  active: boolean;
};

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
  variants?: ProductVariant[];
};

type ProductRow = {
  id: string; slug: string; name: string; origin: string; price: number; weight: string;
  image_url: string | null; description: string | null; published: number; category_id: string; created_at: string;
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id, slug: row.slug, name: row.name, origin: row.origin, price: row.price, weight: row.weight,
    imageUrl: row.image_url, description: row.description, published: Boolean(row.published),
    categoryId: row.category_id, createdAt: row.created_at,
  };
}

export function getProductVariants(productId: string): ProductVariant[] {
  const rows = db.prepare(`
    SELECT v.*, g.title AS grind_title
    FROM product_variants v
    LEFT JOIN grind_options g ON g.id = v.grind_option_id
    WHERE v.product_id = ? ORDER BY CAST(v.weight AS INTEGER) ASC, v.created_at ASC
  `).all(productId) as Array<{ id:string; product_id:string; weight:string; grind_option_id:string|null; price:number; active:number; grind_title:string|null }>;
  return rows.map((r) => ({
    id: r.id, productId: r.product_id, weight: r.weight, grindOptionId: r.grind_option_id,
    grind: r.grind_title, price: r.price, active: Boolean(r.active),
  }));
}

export function listGrindOptions() {
  return db.prepare("SELECT id, slug, title FROM grind_options ORDER BY title ASC").all() as { id: string; slug: string; title: string }[];
}

export function createGrindOption(input: { slug: string; title: string }) {
  const id = newId("grind");
  db.prepare("INSERT INTO grind_options (id, slug, title) VALUES (?, ?, ?)").run(id, input.slug, input.title);
  return { id, ...input };
}

export function updateGrindOption(id: string, input: { slug: string; title: string }) {
  db.prepare("UPDATE grind_options SET slug = ?, title = ? WHERE id = ?").run(input.slug, input.title, id);
}

export function deleteGrindOption(id: string) {
  db.prepare("DELETE FROM grind_options WHERE id = ?").run(id);
}

export function getProductVariant(id: string): ProductVariant | undefined {
  const row = db.prepare(`
    SELECT v.*, g.title AS grind_title FROM product_variants v
    LEFT JOIN grind_options g ON g.id = v.grind_option_id WHERE v.id = ?
  `).get(id) as { id:string; product_id:string; weight:string; grind_option_id:string|null; price:number; active:number; grind_title:string|null } | undefined;
  if (!row) return undefined;
  return { id: row.id, productId: row.product_id, weight: row.weight, grindOptionId: row.grind_option_id, grind: row.grind_title, price: row.price, active: Boolean(row.active) };
}

export function replaceProductVariants(productId: string, variants: Array<{ weight: string; grindOptionId?: string | null; price: number; active?: boolean }>) {
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM product_variants WHERE product_id = ?").run(productId);
    const insert = db.prepare("INSERT INTO product_variants (id, product_id, weight, grind_option_id, price, active) VALUES (?, ?, ?, ?, ?, ?)");
    for (const v of variants) {
      insert.run(newId("var"), productId, v.weight, v.grindOptionId ?? null, v.price, v.active === false ? 0 : 1);
    }
    const first = variants.find((v) => v.active !== false) ?? variants[0];
    if (first) db.prepare("UPDATE products SET price = ?, weight = ? WHERE id = ?").run(first.price, first.weight, productId);
  });
  tx();
}

export type ProductFilters = {
  categorySlugs?: string[];
  weights?: string[];
  maxPrice?: number;
  search?: string;
  sort?: "default" | "price-asc" | "price-desc" | "name";
  onlyPublished?: boolean;
};

export function listProducts(filters: ProductFilters = {}): Product[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  if (filters.onlyPublished !== false) conditions.push("p.published = 1");
  if (filters.categorySlugs?.length) {
    conditions.push(`c.slug IN (${filters.categorySlugs.map(() => "?").join(",")})`);
    params.push(...filters.categorySlugs);
  }
  if (filters.weights?.length) {
    conditions.push(`p.weight IN (${filters.weights.map(() => "?").join(",")})`);
    params.push(...filters.weights);
  }
  if (typeof filters.maxPrice === "number") { conditions.push("p.price <= ?"); params.push(filters.maxPrice); }
  if (filters.search?.trim()) {
    conditions.push("(p.name LIKE ? OR p.origin LIKE ? OR c.title LIKE ?)");
    const q = `%${filters.search.trim()}%`; params.push(q, q, q);
  }
  let orderBy = "p.created_at DESC";
  if (filters.sort === "price-asc") orderBy = "p.price ASC";
  else if (filters.sort === "price-desc") orderBy = "p.price DESC";
  else if (filters.sort === "name") orderBy = "p.name ASC";
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = db.prepare(`SELECT p.* FROM products p JOIN categories c ON c.id = p.category_id ${where} ORDER BY ${orderBy}`).all(...params) as ProductRow[];
  return rows.map(mapRow);
}

export function getAllProductsForAdmin(): Product[] {
  return (db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as ProductRow[]).map(mapRow);
}
export function getProductBySlug(slug: string): Product | undefined {
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as ProductRow | undefined;
  return row ? mapRow(row) : undefined;
}
export function getProductById(id: string): Product | undefined {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
  return row ? mapRow(row) : undefined;
}
export function getProductWithVariantsBySlug(slug: string) {
  const p = getProductBySlug(slug); if (!p) return undefined;
  return { ...p, variants: getProductVariants(p.id) };
}
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return (db.prepare("SELECT * FROM products WHERE category_id = ? AND id != ? AND published = 1 ORDER BY created_at DESC LIMIT ?").all(product.categoryId, product.id, limit) as ProductRow[]).map(mapRow);
}
export function getFeaturedProducts(limit = 4): Product[] {
  return (db.prepare("SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC LIMIT ?").all(limit) as ProductRow[]).map(mapRow);
}
export function getPriceRange() {
  const row = db.prepare("SELECT MIN(price) as min, MAX(price) as max FROM products").get() as { min: number | null; max: number | null };
  return { min: row.min ?? 0, max: row.max ?? 0 };
}

export function createProduct(input: { slug: string; name: string; origin: string; price: number; weight: string; imageUrl?: string; description?: string; published: boolean; categoryId: string; variants?: Array<{weight:string; grindOptionId?:string|null; price:number; active?:boolean}> }): Product {
  const id = newId("prod");
  const tx = db.transaction(() => {
    db.prepare(`INSERT INTO products (id, slug, name, origin, price, weight, image_url, description, published, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, input.slug, input.name, input.origin, input.price, input.weight, input.imageUrl ?? null, input.description ?? null, input.published ? 1 : 0, input.categoryId);
    const variants = input.variants?.length ? input.variants : [{ weight: input.weight, price: input.price, grindOptionId: null }];
    const insert = db.prepare("INSERT INTO product_variants (id, product_id, weight, grind_option_id, price, active) VALUES (?, ?, ?, ?, ?, ?)");
    for (const v of variants) insert.run(newId("var"), id, v.weight, v.grindOptionId ?? null, v.price, v.active === false ? 0 : 1);
  });
  tx();
  return getProductById(id)!;
}

export function updateProduct(id: string, input: { slug: string; name: string; origin: string; price: number; weight: string; imageUrl?: string|null; description?: string; published: boolean; categoryId: string; variants?: Array<{weight:string; grindOptionId?:string|null; price:number; active?:boolean}> }) {
  db.prepare(`UPDATE products SET slug = ?, name = ?, origin = ?, price = ?, weight = ?, image_url = ?, description = ?, published = ?, category_id = ? WHERE id = ?`)
    .run(input.slug, input.name, input.origin, input.price, input.weight, input.imageUrl ?? null, input.description ?? null, input.published ? 1 : 0, input.categoryId, id);
  if (input.variants) replaceProductVariants(id, input.variants);
}
export function deleteProduct(id: string) { db.prepare("DELETE FROM products WHERE id = ?").run(id); }
