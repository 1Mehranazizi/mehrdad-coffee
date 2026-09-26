import LegalPage from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="حریم خصوصی"
      description="نحوه جمع‌آوری، استفاده و محافظت از اطلاعات کاربران در قهوه مهرداد."
    >
      <div className="space-y-10">
        <section>
          <SectionTitle number="۰۱" title="مقدمه" />

          <p className="text-sm leading-8 text-ink-soft">
            حفظ حریم خصوصی کاربران برای قهوه مهرداد اهمیت دارد. اطلاعاتی که در
            هنگام استفاده از سایت یا ثبت سفارش در اختیار ما قرار می‌دهید، صرفاً
            در چارچوب ارائه خدمات، پردازش سفارش‌ها و بهبود تجربه کاربری مورد
            استفاده قرار می‌گیرد.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۲" title="اطلاعاتی که ممکن است دریافت شود" />

          <p className="text-sm leading-8 text-ink-soft">
            بسته به نوع استفاده شما از سایت، ممکن است اطلاعاتی مانند نام و نام
            خانوادگی، شماره تماس، نشانی، کد پستی، اطلاعات مربوط به سفارش و
            اطلاعات موردنیاز برای ارسال کالا از شما دریافت شود.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۳" title="نحوه استفاده از اطلاعات" />

          <div className="rounded-2xl border border-line bg-paper p-5">
            <ul className="space-y-3 text-sm leading-8 text-ink-soft">
              <li>• پردازش و تکمیل سفارش‌های ثبت‌شده</li>
              <li>• ارسال محصولات به آدرس ثبت‌شده</li>
              <li>• ارتباط با مشتری درباره سفارش و خدمات فروشگاه</li>
              <li>• پاسخ‌گویی به درخواست‌ها و مشکلات کاربران</li>
              <li>• بهبود عملکرد و تجربه استفاده از سایت</li>
              <li>• جلوگیری از سوءاستفاده و فعالیت‌های غیرمجاز</li>
            </ul>
          </div>
        </section>

        <section>
          <SectionTitle number="۰۴" title="حفاظت از اطلاعات کاربران" />

          <p className="text-sm leading-8 text-ink-soft">
            ما تلاش می‌کنیم اطلاعات کاربران را با استفاده از اقدامات فنی و
            مدیریتی مناسب محافظت کنیم و دسترسی به اطلاعات را تا حد امکان به
            افراد و سرویس‌هایی که برای ارائه خدمات به آن نیاز دارند محدود کنیم.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۵" title="اطلاعات پرداخت" />

          <p className="text-sm leading-8 text-ink-soft">
            پرداخت‌های آنلاین از طریق درگاه پرداخت انجام می‌شوند. اطلاعات حساس
            مربوط به کارت بانکی مانند رمز دوم، CVV2 و اطلاعات مشابه نباید در
            اختیار فروشگاه قرار گیرد و کاربران باید این اطلاعات را تنها در محیط
            رسمی درگاه پرداخت وارد کنند.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۶" title="کوکی‌ها و اطلاعات فنی" />

          <p className="text-sm leading-8 text-ink-soft">
            سایت ممکن است برای ارائه عملکرد بهتر، حفظ وضعیت ورود، مدیریت سبد
            خرید و تحلیل نحوه استفاده از خدمات از کوکی‌ها یا فناوری‌های مشابه
            استفاده کند.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۷" title="اشتراک‌گذاری اطلاعات" />

          <p className="text-sm leading-8 text-ink-soft">
            اطلاعات کاربران جز در موارد موردنیاز برای ارائه خدمات، مانند پردازش
            پرداخت یا ارسال سفارش، و همچنین مواردی که به موجب قوانین و مقررات
            لازم باشد، در اختیار اشخاص ثالث قرار نخواهد گرفت.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۸" title="مسئولیت اطلاعات واردشده" />

          <p className="text-sm leading-8 text-ink-soft">
            کاربران مسئول صحت اطلاعاتی هستند که هنگام ثبت سفارش یا استفاده از
            سایت وارد می‌کنند. وارد کردن اطلاعات صحیح به انجام سریع‌تر سفارش و
            جلوگیری از مشکلات ارسال کمک می‌کند.
          </p>
        </section>

        <section>
          <SectionTitle number="۰۹" title="به‌روزرسانی سیاست حریم خصوصی" />

          <p className="text-sm leading-8 text-ink-soft">
            ممکن است این سیاست با توجه به تغییر خدمات فروشگاه یا الزامات قانونی
            به‌روزرسانی شود. نسخه جدید سیاست حریم خصوصی در همین صفحه منتشر خواهد
            شد.
          </p>
        </section>
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
