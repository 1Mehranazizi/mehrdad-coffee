import bcrypt from "bcryptjs";
import { db } from "./client";
import { newId } from "./ids";

function seedCategories() {
  const existing = db.prepare("SELECT COUNT(*) as n FROM categories").get() as { n: number };
  if (existing.n > 0) return;

  const categories = [
    { slug: "coffee", title: "قهوه", description: "دان و پودر قهوه تازه برشته‌شده", requiresGrind: 1 },
    { slug: "nescafe", title: "نسکافه", description: "نسکافه فوری، آماده در چند ثانیه", requiresGrind: 0 },
    { slug: "hot-chocolate", title: "هات چاکلت", description: "پودر شکلات داغ، غلیظ و کاکائویی", requiresGrind: 0 },
    { slug: "masala-chai", title: "چای ماسالا", description: "چای ادویه‌ای هندی، معطر و گرم‌کننده", requiresGrind: 0 },
  ];

  const insert = db.prepare(
    "INSERT INTO categories (id, slug, title, description, requires_grind) VALUES (?, ?, ?, ?, ?)"
  );
  for (const c of categories) {
    insert.run(newId("cat"), c.slug, c.title, c.description, c.requiresGrind);
  }
}

function seedGrindTypes() {
  const existing = db.prepare("SELECT COUNT(*) as n FROM grind_types").get() as { n: number };
  if (existing.n > 0) return;

  const types = ["دان کامل (بدون آسیاب)", "اسپرسو", "فرنچ‌پرس", "موکاپات", "فیلتر (V60 / کمکس)", "ترک (فوق‌ریز)"];
  const insert = db.prepare("INSERT INTO grind_types (id, title, sort_order) VALUES (?, ?, ?)");
  types.forEach((title, i) => insert.run(newId("grind"), title, i));
}

function seedProducts() {
  const existing = db.prepare("SELECT COUNT(*) as n FROM products").get() as { n: number };
  if (existing.n > 0) return;

  const categoryRows = db.prepare("SELECT id, slug FROM categories").all() as { id: string; slug: string }[];
  const categoryIdBySlug = Object.fromEntries(categoryRows.map((c) => [c.slug, c.id]));

  const grindRows = db.prepare("SELECT id, title FROM grind_types ORDER BY sort_order").all() as {
    id: string;
    title: string;
  }[];
  const grindByTitle = Object.fromEntries(grindRows.map((g) => [g.title, g.id]));

  const insertProduct = db.prepare(
    `INSERT INTO products (id, slug, name, origin, description, published, category_id)
     VALUES (?, ?, ?, ?, ?, 1, ?)`
  );
  const insertVariant = db.prepare(
    `INSERT INTO product_variants (id, product_id, weight, grind_type_id, price) VALUES (?, ?, ?, ?, ?)`
  );

  type SeedProduct = {
    slug: string;
    name: string;
    origin: string;
    category: string;
    variants: { weight: string; grind?: string; price: number }[];
  };

  const products: SeedProduct[] = [
    {
      slug: "mehrdad-espresso-classic",
      name: "بلند اسپرسو کلاسیک",
      origin: "برزیل و اتیوپی",
      category: "coffee",
      variants: [
        { weight: "250", grind: "اسپرسو", price: 385000 },
        { weight: "250", grind: "دان کامل (بدون آسیاب)", price: 385000 },
        { weight: "500", grind: "اسپرسو", price: 720000 },
      ],
    },
    {
      slug: "mehrdad-filter-yirgacheffe",
      name: "یرگاچف فیلتر",
      origin: "اتیوپی",
      category: "coffee",
      variants: [
        { weight: "250", grind: "فیلتر (V60 / کمکس)", price: 420000 },
        { weight: "250", grind: "دان کامل (بدون آسیاب)", price: 420000 },
      ],
    },
    {
      slug: "mehrdad-turkish-classic",
      name: "پودر ترک ممتاز",
      origin: "بلند اختصاصی مهرداد",
      category: "coffee",
      variants: [
        { weight: "250", grind: "ترک (فوق‌ریز)", price: 310000 },
        { weight: "500", grind: "ترک (فوق‌ریز)", price: 590000 },
      ],
    },
    {
      slug: "mehrdad-whole-bean-signature",
      name: "بلند سیگنیچر مهرداد",
      origin: "اتیوپی، برزیل و هند",
      category: "coffee",
      variants: [
        { weight: "500", grind: "دان کامل (بدون آسیاب)", price: 690000 },
        { weight: "1000", grind: "دان کامل (بدون آسیاب)", price: 1300000 },
        { weight: "500", grind: "موکاپات", price: 690000 },
      ],
    },
    {
      slug: "mehrdad-nescafe-classic",
      name: "نسکافه کلاسیک",
      origin: "برزیل",
      category: "nescafe",
      variants: [
        { weight: "250", price: 280000 },
        { weight: "500", price: 520000 },
      ],
    },
    {
      slug: "mehrdad-nescafe-3in1",
      name: "نسکافه ۳ در ۱",
      origin: "ترکیب ویژه مهرداد",
      category: "nescafe",
      variants: [{ weight: "250", price: 260000 }],
    },
    {
      slug: "mehrdad-hot-chocolate-classic",
      name: "هات چاکلت کلاسیک",
      origin: "کاکائوی بلژیک",
      category: "hot-chocolate",
      variants: [
        { weight: "250", price: 300000 },
        { weight: "500", price: 560000 },
      ],
    },
    {
      slug: "mehrdad-masala-chai",
      name: "چای ماسالا اصیل",
      origin: "ادویه‌جات هندی",
      category: "masala-chai",
      variants: [
        { weight: "250", price: 290000 },
        { weight: "500", price: 540000 },
      ],
    },
  ];

  for (const p of products) {
    const productId = newId("prod");
    insertProduct.run(
      productId,
      p.slug,
      p.name,
      p.origin,
      `${p.name} با دانه‌ها و مواد اولیه‌ی ${p.origin} تهیه و در کرمانشاه تازه بسته‌بندی می‌شود.`,
      categoryIdBySlug[p.category]
    );
    for (const v of p.variants) {
      insertVariant.run(
        newId("var"),
        productId,
        v.weight,
        v.grind ? grindByTitle[v.grind] ?? null : null,
        v.price
      );
    }
  }
}

function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@mehrdadcoffee.ir";
  const existing = db.prepare("SELECT id FROM admins WHERE email = ?").get(email);
  if (existing) return;

  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO admins (id, email, password_hash, name) VALUES (?, ?, ?, ?)").run(
    newId("admin"),
    email,
    passwordHash,
    "مدیر مهرداد"
  );

  console.log(`Admin seeded → email: ${email} / password: ${password}`);
}

function seedArticle() {
  const existing = db.prepare("SELECT COUNT(*) as n FROM articles").get() as { n: number };
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
  seedGrindTypes();
  seedProducts();
  seedAdmin();
  seedArticle();
  console.log("Seed complete.");
}

main();
