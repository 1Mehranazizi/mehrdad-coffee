import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const IS_PRODUCTION_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, "app.db");
const SCHEMA_PATH = path.join(process.cwd(), "src/server/db/schema.sql");

function migrate(connection: Database.Database) {
  // Lightweight, idempotent migrations for the SQLite database shipped with the project.
  const columns = connection.prepare("PRAGMA table_info(order_items)").all() as { name: string }[];
  if (!columns.some((c) => c.name === "grind")) {
    connection.exec("ALTER TABLE order_items ADD COLUMN grind TEXT");
  }

  const categoryRows = connection.prepare("SELECT id, slug FROM categories").all() as { id: string; slug: string }[];
  const coffee = categoryRows.find((c) => c.slug === "coffee");
  const legacy = categoryRows.filter((c) => ["espresso", "filter", "turkish", "whole-bean"].includes(c.slug));
  if (!coffee && legacy.length) {
    const first = legacy[0];
    connection.prepare("UPDATE categories SET slug = ?, title = ?, description = ? WHERE id = ?")
      .run("coffee", "قهوه", "دان و پودر قهوه تازه برشته‌شده", first.id);
  }
  const categories = [
    ["coffee", "قهوه", "دان و پودر قهوه تازه برشته‌شده"],
    ["nescafe", "نسکافه", "قهوه فوری و محصولات آماده"],
    ["hot-chocolate", "هات چاکلت", "نوشیدنی شکلاتی گرم و خوش‌عطر"],
    ["masala-tea", "چای ماسالا", "ترکیب ادویه‌ای گرم و معطر"],
    ["tea", "چای", "انواع چای برای دم‌آوری روزانه"],
  ] as const;
  const insert = connection.prepare("INSERT OR IGNORE INTO categories (id, slug, title, description) VALUES (?, ?, ?, ?)");
  for (const [slug, title, description] of categories) {
    const existing = connection.prepare("SELECT id FROM categories WHERE slug = ?").get(slug) as { id: string } | undefined;
    if (!existing) insert.run(`cat_${slug}`, slug, title, description);
  }
  const coffeeCategory = connection.prepare("SELECT id FROM categories WHERE slug='coffee'").get() as { id: string } | undefined;
  if (coffeeCategory && legacy.length) {
    // Move products from legacy coffee categories to the unified coffee category.
    const legacyIds = legacy.map((x) => x.id).filter((id) => id !== coffeeCategory.id);
    for (const id of legacyIds) connection.prepare("UPDATE products SET category_id = ? WHERE category_id = ?").run(coffeeCategory.id, id);
  }

  const grindDefaults = [
    ["espresso", "اسپرسو", "آسیاب اسپرسو"],
    ["moka", "موکاپات", "آسیاب موکاپات"],
    ["filter", "فرانسه / V60", "آسیاب متوسط"],
    ["french-press", "فرنچ‌پرس", "آسیاب درشت"],
    ["turkish", "ترک", "آسیاب خیلی ریز"],
  ] as const;
  const insertGrind = connection.prepare("INSERT OR IGNORE INTO grind_options (id, slug, title) VALUES (?, ?, ?)");
  for (const [slug, title] of grindDefaults) insertGrind.run(`grind_${slug}`, slug, title);

  // Every existing product gets one selectable variant, preserving its current price/weight.
  const products = connection.prepare("SELECT id, price, weight FROM products").all() as { id: string; price: number; weight: string }[];
  const insertVariant = connection.prepare(
    "INSERT OR IGNORE INTO product_variants (id, product_id, weight, grind_option_id, price, active) VALUES (?, ?, ?, NULL, ?, 1)"
  );
  for (const p of products) {
    const exists = connection.prepare("SELECT id FROM product_variants WHERE product_id = ? LIMIT 1").get(p.id);
    if (!exists) insertVariant.run(`var_${p.id}`, p.id, p.weight, p.price);
  }
}

function createConnection() {
  // Next.js evaluates route modules during `next build`. Never open the
  // mutable production SQLite file during that phase: a stale/corrupt WAL
  // file must not make an otherwise valid build fail.
  const connection = new Database(IS_PRODUCTION_BUILD ? ":memory:" : DB_PATH);

  if (!IS_PRODUCTION_BUILD) {
    // WAL is useful at runtime, but it is not required for correctness.
    // If a filesystem/locking issue prevents switching modes, keep going in
    // the default journal mode instead of failing module evaluation.
    try {
      connection.pragma("journal_mode = WAL");
    } catch {
      // Fall back to SQLite's default journal mode.
    }
  }

  connection.pragma("foreign_keys = ON");
  connection.exec(fs.readFileSync(SCHEMA_PATH, "utf-8"));
  migrate(connection);
  return connection;
}

declare global { var __dbConnection: Database.Database | undefined; }
export const db = globalThis.__dbConnection ?? createConnection();
if (process.env.NODE_ENV !== "production") globalThis.__dbConnection = db;
