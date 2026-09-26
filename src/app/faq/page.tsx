import LegalPage from "@/components/legal/LegalPage";

const faqs = [
  {
    question: "چطور می‌توانم از قهوه مهرداد خرید کنم؟",
    answer:
      "محصول موردنظر خود را از فروشگاه انتخاب کرده و پس از افزودن آن به سبد خرید، مراحل ثبت سفارش و پرداخت را تکمیل کنید. پس از ثبت موفق سفارش، اطلاعات سفارش برای شما نمایش داده می‌شود.",
  },
  {
    question: "آیا برای خرید نیاز به ایجاد حساب کاربری دارم؟",
    answer:
      "در صورت فعال بودن خرید بدون ثبت‌نام در فروشگاه، می‌توانید سفارش خود را بدون ایجاد حساب کاربری ثبت کنید. در غیر این صورت، هنگام ثبت سفارش از شما اطلاعات لازم دریافت خواهد شد.",
  },
  {
    question: "هزینه ارسال سفارش چقدر است؟",
    answer:
      "هزینه ارسال بر اساس مقصد، روش ارسال و شرایط سفارش محاسبه می‌شود و مبلغ نهایی پیش از تکمیل پرداخت به شما نمایش داده خواهد شد.",
  },
  {
    question: "هزینه ارسال سفارش برای شهر کرمانشاه رایگان است؟",
    answer:
      "بله. هزینه ارسال برای شهر کرمانشاه رایگان است و سفارش همان روز ارسال می شود.",
  },
  {
    question: "سفارش من چه زمانی ارسال می‌شود؟",
    answer:
      "پس از ثبت و تأیید سفارش، فرآیند آماده‌سازی و ارسال انجام می‌شود. زمان تقریبی تحویل بسته به شهر مقصد و روش ارسال انتخاب‌شده متفاوت است.",
  },
  {
    question: "چطور می‌توانم وضعیت سفارشم را پیگیری کنم؟",
    answer:
      "پس از ارسال سفارش، در صورت ارائه کد رهگیری توسط شرکت حمل‌ونقل، اطلاعات رهگیری سفارش در اختیار شما قرار می‌گیرد.",
  },
  {
    question: "آیا امکان لغو سفارش وجود دارد؟",
    answer:
      "اگر سفارش هنوز وارد مرحله ارسال نشده باشد، برای بررسی امکان لغو می‌توانید در سریع‌ترین زمان با پشتیبانی فروشگاه تماس بگیرید. پس از ارسال، شرایط لغو تابع مقررات بازگشت کالا خواهد بود.",
  },
  {
    question: "اگر محصول آسیب‌دیده به دستم برسد چه کاری باید انجام دهم؟",
    answer:
      "در صورت مشاهده آسیب‌دیدگی بسته یا محصول، در اولین فرصت موضوع را به پشتیبانی اطلاع دهید و تصاویر واضحی از بسته‌بندی و محصول ارسال کنید تا درخواست شما بررسی شود.",
  },
  {
    question: "آیا امکان بازگشت کالا وجود دارد؟",
    answer:
      "بازگشت کالا در شرایط مشخص‌شده در صفحه شرایط بازگشت کالا امکان‌پذیر است. لطفاً پیش از ارسال کالا، شرایط و محدودیت‌های مربوط به بازگشت را مطالعه کنید.",
  },
  {
    question: "چطور با پشتیبانی تماس بگیرم؟",
    answer:
      "برای ارتباط با پشتیبانی می‌توانید از اطلاعات تماس درج‌شده در بخش تماس با ما یا اطلاعات موجود در سایت استفاده کنید.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-line last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-right font-bold text-ink marker:hidden">
        <span>{question}</span>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-coffee transition group-open:rotate-45 group-open:border-brass group-open:text-brass">
          <span className="text-lg font-normal">+</span>
        </span>
      </summary>

      <div className="pb-5 pl-12 text-sm leading-8 text-ink-soft">{answer}</div>
    </details>
  );
}

export default function FAQPage() {
  return (
    <LegalPage
      title="سوالات متداول"
      description="پاسخ پرسش‌های متداول درباره ثبت سفارش، پرداخت، ارسال و بازگشت محصولات قهوه مهرداد."
    >
      <div className="mb-8 border-b border-line pb-7">
        <span className="inline-flex rounded-full bg-paper-deep px-4 py-2 text-xs font-medium text-coffee">
          راهنمای خرید
        </span>

        <h2 className="mt-4 text-2xl font-bold">پاسخ پرسش‌های شما</h2>

        <p className="mt-3 text-sm leading-8 text-ink-soft">
          اگر پاسخ سؤال خود را در این بخش پیدا نکردید، از طریق راه‌های ارتباطی
          موجود در سایت با ما در تماس باشید.
        </p>
      </div>

      <div>
        {faqs.map((faq) => (
          <FaqItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </LegalPage>
  );
}
