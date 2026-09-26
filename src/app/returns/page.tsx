import LegalPage from "@/components/legal/LegalPage";

export default function ReturnPolicyPage() {
  return (
    <LegalPage
      title="شرایط بازگشت کالا"
      description="شرایط و ضوابط مربوط به بررسی، تعویض یا بازگشت سفارش‌های قهوه مهرداد."
    >
      <div className="space-y-10">
        <section>
          <SectionTitle number="۰۱" title="شرایط کلی بازگشت" />

          <p className="text-sm leading-8 text-ink-soft">
            رضایت مشتری برای ما اهمیت زیادی دارد. در صورتی که کالای دریافت‌شده
            دارای ایراد، مغایرت با سفارش یا شرایطی باشد که مطابق قوانین و مقررات
            فروشگاه امکان بازگشت آن وجود داشته باشد، درخواست شما پس از بررسی
            کارشناسان پشتیبانی قابل پیگیری خواهد بود.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۲" title="کالاهای دارای ایراد یا مغایرت" />

          <p className="text-sm leading-8 text-ink-soft">
            اگر کالای دریافت‌شده با سفارش ثبت‌شده مغایرت داشته باشد یا هنگام
            دریافت متوجه آسیب‌دیدگی آن شوید، لطفاً در اولین فرصت موضوع را به
            پشتیبانی اطلاع دهید. برای بررسی سریع‌تر، ممکن است ارسال تصاویر واضح
            از محصول، بسته‌بندی و اطلاعات سفارش درخواست شود.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۳" title="شرایط قابل قبول برای بازگشت" />

          <div className="mt-4 rounded-2xl border border-line bg-paper p-5">
            <ul className="space-y-3 text-sm leading-8 text-ink-soft">
              <li>
                • محصول باید در شرایطی باشد که امکان بررسی و پذیرش بازگشت آن
                وجود داشته باشد.
              </li>
              <li>
                • در صورت وجود بسته‌بندی، متعلقات و اقلام همراه، بازگشت آن‌ها
                نیز مورد نیاز است.
              </li>
              <li>
                • کالا نباید به‌گونه‌ای استفاده شده باشد که امکان بررسی وضعیت
                اولیه آن از بین برود.
              </li>
              <li>
                • درخواست بازگشت باید از طریق راه ارتباطی رسمی فروشگاه ثبت شود.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <SectionTitle
            number="۰۴"
            title="مواردی که ممکن است امکان بازگشت نداشته باشند"
          />

          <p className="text-sm leading-8 text-ink-soft">
            کالاهایی که به دلیل ماهیت محصول، شرایط نگهداری یا استفاده، امکان
            بازگشت آن‌ها پس از تحویل وجود ندارد، مشمول بازگشت نخواهند بود؛ مگر
            اینکه کالا دارای ایراد یا مغایرت قابل اثبات باشد.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۵" title="هزینه بازگشت کالا" />

          <p className="text-sm leading-8 text-ink-soft">
            نحوه پرداخت هزینه ارسال برگشت، بر اساس علت بازگشت و نتیجه بررسی
            درخواست مشخص خواهد شد. در مواردی که ایراد یا مغایرت کالا از طرف
            فروشگاه تأیید شود، موضوع هزینه ارسال مطابق مقررات فروشگاه بررسی
            خواهد شد.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۶" title="نحوه ثبت درخواست" />

          <div className="rounded-2xl bg-coffee p-6 text-paper">
            <p className="text-sm leading-8 text-paper/80">
              برای ثبت درخواست بازگشت، اطلاعات سفارش و شرح درخواست خود را از
              طریق راه‌های ارتباطی اعلام‌شده در سایت برای پشتیبانی ارسال کنید.
              پس از بررسی اطلاعات، مراحل بعدی به شما اعلام خواهد شد.
            </p>
          </div>
        </section>

        <section>
          <SectionTitle number="۰۷" title="بازپرداخت وجه" />

          <p className="text-sm leading-8 text-ink-soft">
            در صورت تأیید بازگشت و استرداد وجه، مبلغ قابل بازپرداخت مطابق نتیجه
            بررسی سفارش و مقررات فروشگاه محاسبه شده و از طریق روش پرداخت مربوطه
            به مشتری مسترد خواهد شد.
          </p>
        </section>

        <div className="rounded-2xl border border-brass/40 bg-brass/10 p-5">
          <p className="text-sm leading-8 text-coffee-deep">
            <strong>توجه:</strong> پیش از ارسال کالا برای بازگشت، حتماً با
            پشتیبانی هماهنگ کنید. ارسال کالا بدون ثبت درخواست ممکن است باعث
            تأخیر در بررسی و پردازش درخواست شود.
          </p>
        </div>
      </div>
    </LegalPage>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-deep text-xs font-bold text-coffee">
        {number}
      </span>

      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}
