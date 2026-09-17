export const weightOptions = [
  { value: "250", label: "۲۵۰ گرم" },
  { value: "500", label: "۵۰۰ گرم" },
  { value: "1000", label: "۱ کیلوگرم" },
] as const;

export type Weight = (typeof weightOptions)[number]["value"];

export type GrindOption = {
  id: string;
  title: string;
  slug: string;
};

export const sortOptions = [
  { value: "default", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "name", label: "الفبایی" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

export function weightLabel(weight: string) {
  return weight === "1000" ? "۱ کیلوگرم" : weight === "500" ? "۵۰۰ گرم" : "۲۵۰ گرم";
}

export function formatToman(value: number) {
  return `${value.toLocaleString("fa-IR")} تومان`;
}

export const brewingTips: Record<string, string> = {
  coffee: "برای اسپرسو از آسیاب متناسب با دستگاه استفاده کنید؛ برای روش‌های فیلتری آسیاب متوسط و برای فرنچ‌پرس آسیاب درشت مناسب است.",
  nescafe: "با آب داغ (نه جوش) و مقدار دلخواه شیر یا شکر آماده کنید.",
  "hot-chocolate": "پودر را با شیر گرم مخلوط کنید و قبل از جوش آمدن از روی حرارت بردارید.",
  "masala-tea": "با شیر داغ دم کنید و برای عطر بیشتر چند دقیقه زمان بدهید.",
  tea: "دمای آب و زمان دم‌آوری را متناسب با نوع چای تنظیم کنید.",
};
