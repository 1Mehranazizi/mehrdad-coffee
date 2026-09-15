import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "ورود | قهوه مهرداد" };

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-cream p-7">
          <h1 className="text-2xl font-extrabold text-ink text-center">
            ورود / ثبت‌نام
          </h1>
          <p className="mt-2 text-sm text-ink-soft text-center">
            با شماره موبایل خود وارد شوید؛ کد تایید برایتان پیامک می‌شود.
          </p>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
