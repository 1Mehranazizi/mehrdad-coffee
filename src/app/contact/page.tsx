import { AtSign, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "تماس با ما | قهوه مهرداد" };

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-line bg-paper-deep/60">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">تماس با ما</h1>
            <p className="mt-2 text-ink-soft">خوشحال می‌شویم از شما بشنویم.</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-14 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-cream p-6 text-center">
            <MapPin className="h-6 w-6 mx-auto text-coffee" />
            <p className="mt-3 text-sm text-ink-soft leading-6">
              کرمانشاه، بلوار مهدیه، ابتدای خیابان حاج محمد تقی اصفهانی
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-cream p-6 text-center">
            <Phone className="h-6 w-6 mx-auto text-coffee" />
            <p className="mt-3 text-sm text-ink-soft" dir="ltr">
              0918 233 6011
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-cream p-6 text-center">
            <AtSign className="h-6 w-6 mx-auto text-coffee" />
            <a
              href="https://instagram.com/meehrdad_coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-ink-soft hover:text-coffee transition-colors"
            >
              meehrdad_coffee
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
