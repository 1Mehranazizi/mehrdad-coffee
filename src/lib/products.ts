export type Weight = "250" | "500" | "1000";

export const weightOptions: { value: Weight; label: string }[] = [
  { value: "250", label: "۲۵۰ گرم" },
  { value: "500", label: "۵۰۰ گرم" },
  { value: "1000", label: "۱ کیلوگرم" },
];

export function weightLabel(weight: string): string {
  return weightOptions.find((w) => w.value === weight)?.label ?? weight;
}

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
