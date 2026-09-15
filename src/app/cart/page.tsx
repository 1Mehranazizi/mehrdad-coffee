import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartClient from "@/components/cart/CartClient";

export const metadata = { title: "سبد خرید | قهوه مهرداد" };

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <CartClient />
      </main>
      <Footer />
    </>
  );
}
