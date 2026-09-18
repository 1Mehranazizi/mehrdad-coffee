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
  coffee:
    "برای بهترین طعم، دانه را نزدیک به زمان دم‌آوری و متناسب با روش خودتان (اسپرسو، فرنچ‌پرس، موکاپات یا فیلتر) آسیاب کنید.",
  nescafe:
    "یک تا دو قاشق چای‌خوری نسکافه را در آب داغ (نه جوش) حل کنید؛ برای طعم ملایم‌تر با شیر گرم میکس کنید.",
  "hot-chocolate":
    "دو تا سه قاشق پودر را در شیر گرم به‌آرامی هم بزنید تا کاملاً حل شود؛ برای طعم غلیظ‌تر مقدار پودر را افزایش دهید.",
  "masala-chai":
    "پودر را همراه با آب و شیر روی حرارت ملایم دم کنید و اجازه دهید چند دقیقه بجوشد تا عطر ادویه‌ها آزاد شود.",
};
