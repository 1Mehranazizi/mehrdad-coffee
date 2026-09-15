import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata = { title: "تسویه حساب | قهوه مهرداد" };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-line bg-paper-deep/60">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              تکمیل سفارش
            </h1>
          </div>
        </div>
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}
