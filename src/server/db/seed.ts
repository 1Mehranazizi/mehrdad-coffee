import bcrypt from "bcryptjs";
import { db } from "./client";
import { newId } from "./ids";

function seedCategories() {
  const existing = db.prepare("SELECT COUNT(*) as n FROM categories").get() as {
    n: number;
  };
  if (existing.n > 0) return;

  const categories = [
    {
      slug: "espresso",
      title: "اسپرسو",
      description: "رست تیره، بادی سنگین، مناسب دستگاه اسپرسوساز",
    },
    {
      slug: "filter",
      title: "قهوه فیلتر",
      description: "رست متوسط، عطر شفاف، مناسب V60 و کمکس",
    },
    {
      slug: "turkish",
      title: "پودر ترک",
      description: "آسیاب فوق‌ریز، مناسب دم‌کردن سنتی",
    },
    {
      slug: "whole-bean",
      title: "دان کامل",
      description: "تازه برشته‌شده، برای آسیاب در خانه",
    },
  ];

  const insert = db.prepare(
    "INSERT INTO categories (id, slug, title, description) VALUES (?, ?, ?, ?)"
  );
  const ids: Record<string, string> = {};
  for (const c of categories) {
    const id = newId("cat");
    insert.run(id, c.slug, c.title, c.description);
    ids[c.slug] = id;
  }
  return ids;
}

function seedProducts() {
  const existing = db.prepare("SELECT COUNT(*) as n FROM products").get() as {
    n: number;
  };
  if (existing.n > 0) return;

  const categoryRows = db.prepare("SELECT id, slug FROM categories").all() as {
    id: string;
    slug: string;
  }[];
  const categoryIdBySlug = Object.fromEntries(
    categoryRows.map((c) => [c.slug, c.id])
  );

  const products = [
    { slug: "mehrdad-espresso-classic", name: "بلند اسپرسو کلاسیک", origin: "برزیل و اتیوپی", price: 385000, weight: "250", category: "espresso" },
    { slug: "mehrdad-espresso-dark", name: "اسپرسو رست تیره", origin: "برزیل و هند", price: 620000, weight: "1000", category: "espresso" },
    { slug: "mehrdad-espresso-decaf", name: "اسپرسو بدون کافئین", origin: "کلمبیا", price: 455000, weight: "250", category: "espresso" },
    { slug: "mehrdad-espresso-blend-mild", name: "اسپرسو بلند ملایم", origin: "برزیل و کلمبیا", price: 275000, weight: "250", category: "espresso" },
    { slug: "mehrdad-filter-yirgacheffe", name: "یرگاچف فیلتر", origin: "اتیوپی", price: 420000, weight: "250", category: "filter" },
    { slug: "mehrdad-filter-light", name: "فیلتر رست روشن", origin: "کنیا", price: 460000, weight: "250", category: "filter" },
    { slug: "mehrdad-filter-house", name: "فیلتر هاوس بلند", origin: "کلمبیا و اتیوپی", price: 560000, weight: "500", category: "filter" },
    { slug: "mehrdad-turkish-classic", name: "پودر ترک ممتاز", origin: "بلند اختصاصی مهرداد", price: 310000, weight: "250", category: "turkish" },
    { slug: "mehrdad-turkish-cardamom", name: "پودر ترک با هل", origin: "بلند اختصاصی مهرداد", price: 340000, weight: "250", category: "turkish" },
    { slug: "mehrdad-whole-bean-house", name: "بلند هاوس دان کامل", origin: "کلمبیا و هند", price: 350000, weight: "500", category: "whole-bean" },
    { slug: "mehrdad-whole-bean-signature", name: "بلند سیگنیچر مهرداد", origin: "اتیوپی، برزیل و هند", price: 690000, weight: "1000", category: "whole-bean" },
    { slug: "mehrdad-whole-bean-single-origin", name: "دان کامل تک‌خاستگاه گواتمالا", origin: "گواتمالا", price: 480000, weight: "500", category: "whole-bean" },
  ];

  const insert = db.prepare(
    `INSERT INTO products (id, slug, name, origin, price, weight, description, published, category_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`
  );
  for (const p of products) {
    insert.run(
      newId("prod"),
      p.slug,
      p.name,
      p.origin,
      p.price,
      p.weight,
      `${p.name} با دانه‌های ${p.origin} تهیه و در اصفهان تازه برشته می‌شود.`,
      categoryIdBySlug[p.category]
    );
  }
}

function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@mehrdadcoffee.ir";
  const existing = db.prepare("SELECT id FROM admins WHERE email = ?").get(email);
  if (existing) return;

  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare(
    "INSERT INTO admins (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
  ).run(newId("admin"), email, passwordHash, "مدیر مهرداد");

  console.log(`Admin seeded → email: ${email} / password: ${password}`);
}

function seedArticle() {
  const existing = db.prepare("SELECT COUNT(*) as n FROM articles").get() as {
    n: number;
  };
  if (existing.n > 0) return;

  db.prepare(
    `INSERT INTO articles (id, slug, title, excerpt, content, published)
     VALUES (?, ?, ?, ?, ?, 1)`
  ).run(
    newId("art"),
    "brewing-101",
    "راهنمای دم‌آوری قهوه در خانه",
    "چند نکته‌ی ساده برای گرفتن بهترین طعم از دان‌های تازه برشته.",
    "برای شروع، همیشه دانه را نزدیک به زمان دم‌آوری آسیاب کنید. نسبت رایج ۱ به ۱۵ تا ۱ به ۱۷ (قهوه به آب) نقطه‌ی خوبی برای آزمایش است. دمای آب بین ۹۲ تا ۹۶ درجه‌ی سانتی‌گراد بهترین استخراج را می‌دهد."
  );
}

function main() {
  seedCategories();
  seedProducts();
  seedAdmin();
  seedArticle();
  console.log("Seed complete.");
}

main();
