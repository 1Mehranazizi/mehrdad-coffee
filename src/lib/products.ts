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

export type Product = {
  slug: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
};

export const featuredProducts: Product[] = [
  {
    slug: "mehrdad-espresso-classic",
    name: "بلند اسپرسو کلاسیک",
    origin: "برزیل و اتیوپی",
    price: 385000,
    weight: "۲۵۰ گرم",
  },
  {
    slug: "mehrdad-filter-yirgacheffe",
    name: "یرگاچف فیلتر",
    origin: "اتیوپی",
    price: 420000,
    weight: "۲۵۰ گرم",
  },
  {
    slug: "mehrdad-turkish-classic",
    name: "پودر ترک ممتاز",
    origin: "بلند اختصاصی مهرداد",
    price: 310000,
    weight: "۲۵۰ گرم",
  },
  {
    slug: "mehrdad-whole-bean-house",
    name: "بلند هاوس دان کامل",
    origin: "کلمبیا و هند",
    price: 350000,
    weight: "۵۰۰ گرم",
  },
];

export function formatToman(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}
