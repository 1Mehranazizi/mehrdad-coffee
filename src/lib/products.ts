export type Category = {
  slug: string;
  title: string;
  description: string;
};

export const categories: Category[] = [
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

export type Weight = "250" | "500" | "1000";

export const weightOptions: { value: Weight; label: string }[] = [
  { value: "250", label: "۲۵۰ گرم" },
  { value: "500", label: "۵۰۰ گرم" },
  { value: "1000", label: "۱ کیلوگرم" },
];

export type Product = {
  slug: string;
  name: string;
  origin: string;
  price: number;
  weight: Weight;
  category: string;
};

export const products: Product[] = [
  {
    slug: "mehrdad-espresso-classic",
    name: "بلند اسپرسو کلاسیک",
    origin: "برزیل و اتیوپی",
    price: 385000,
    weight: "250",
    category: "espresso",
  },
  {
    slug: "mehrdad-espresso-dark",
    name: "اسپرسو رست تیره",
    origin: "برزیل و هند",
    price: 620000,
    weight: "1000",
    category: "espresso",
  },
  {
    slug: "mehrdad-espresso-decaf",
    name: "اسپرسو بدون کافئین",
    origin: "کلمبیا",
    price: 455000,
    weight: "250",
    category: "espresso",
  },
  {
    slug: "mehrdad-filter-yirgacheffe",
    name: "یرگاچف فیلتر",
    origin: "اتیوپی",
    price: 420000,
    weight: "250",
    category: "filter",
  },
  {
    slug: "mehrdad-filter-light",
    name: "فیلتر رست روشن",
    origin: "کنیا",
    price: 460000,
    weight: "250",
    category: "filter",
  },
  {
    slug: "mehrdad-filter-house",
    name: "فیلتر هاوس بلند",
    origin: "کلمبیا و اتیوپی",
    price: 560000,
    weight: "500",
    category: "filter",
  },
  {
    slug: "mehrdad-turkish-classic",
    name: "پودر ترک ممتاز",
    origin: "بلند اختصاصی مهرداد",
    price: 310000,
    weight: "250",
    category: "turkish",
  },
  {
    slug: "mehrdad-turkish-cardamom",
    name: "پودر ترک با هل",
    origin: "بلند اختصاصی مهرداد",
    price: 340000,
    weight: "250",
    category: "turkish",
  },
  {
    slug: "mehrdad-whole-bean-house",
    name: "بلند هاوس دان کامل",
    origin: "کلمبیا و هند",
    price: 350000,
    weight: "500",
    category: "whole-bean",
  },
  {
    slug: "mehrdad-whole-bean-signature",
    name: "بلند سیگنیچر مهرداد",
    origin: "اتیوپی، برزیل و هند",
    price: 690000,
    weight: "1000",
    category: "whole-bean",
  },
  {
    slug: "mehrdad-whole-bean-single-origin",
    name: "دان کامل تک‌خاستگاه گواتمالا",
    origin: "گواتمالا",
    price: 480000,
    weight: "500",
    category: "whole-bean",
  },
  {
    slug: "mehrdad-espresso-blend-mild",
    name: "اسپرسو بلند ملایم",
    origin: "برزیل و کلمبیا",
    price: 275000,
    weight: "250",
    category: "espresso",
  },
];

export const featuredProducts = products.slice(0, 4);

export const priceRange = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

export type SortOption = "default" | "price-asc" | "price-desc" | "name";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "پیش‌فرض" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "name", label: "نام (الفبا)" },
];


export function formatToman(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}

export function weightLabel(weight: Weight): string {
  return weightOptions.find((w) => w.value === weight)?.label ?? weight;
}

export function categoryTitle(slug: string): string {
  return categories.find((c) => c.slug === slug)?.title ?? slug;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export const brewingTips: Record<string, string> = {
  espresso:
    "۹ تا ۱۰ گرم پودر را با فشار یکنواخت تمپ کنید و در ۲۵ تا ۳۰ ثانیه، حدود ۳۶ گرم اسپرسو استخراج کنید.",
  filter:
    "۱۵ گرم پودر با آسیاب متوسط را با ۲۵۰ میلی‌لیتر آب ۹۲ تا ۹۶ درجه، طی ۳ تا ۴ دقیقه دم کنید.",
  turkish:
    "یک قاشق چای‌خوری پودر ترک را با آب سرد و شکر دلخواه در قوری بریزید و روی حرارت ملایم تا نیم‌جوش برسانید.",
  "whole-bean":
    "دانه‌ها را نزدیک به زمان دم‌آوری آسیاب کنید تا بیشترین عطر حفظ شود؛ ظرافت آسیاب را متناسب با روش دم‌آوری خود تنظیم کنید.",
};