"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import { toast } from "@/lib/toast-store";

const PHONE_REGEX = /^09\d{9}$/;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!PHONE_REGEX.test(phone)) {
      setError("شماره موبایل را به‌صورت صحیح وارد کنید (۰۹xxxxxxxxx)");
      toast.error("شماره موبایل را به‌صورت صحیح وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        toast.error(data.error || "خطایی رخ داد");
        return;
      }
      toast.success("کد تأیید برای شما پیامک شد");
      setStep("code");
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{5}$/.test(code)) {
      setError("کد ۵ رقمی را کامل وارد کنید");
      toast.error("کد ۵ رقمی را کامل وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        toast.error(data.error || "خطایی رخ داد");
        return;
      }
      toast.success("با موفقیت وارد شدید");
      router.push(next);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  };

  if (step === "phone") {
    return (
      <form onSubmit={requestCode} className="space-y-4">
        <div>
          <label htmlFor="phone" className="text-sm text-ink-soft">
            شماره موبایل
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            dir="ltr"
            placeholder="09123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-center text-sm focus:border-coffee"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
        >
          {loading ? (<><Spinner className="h-4 w-4" /> در حال ارسال...</>) : "دریافت کد تایید"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-4">
      <div>
        <label htmlFor="code" className="text-sm text-ink-soft">
          کد تایید ارسال‌شده به {phone}
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          dir="ltr"
          maxLength={5}
          placeholder="12345"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-center text-lg tracking-[0.5em] focus:border-coffee"
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
      >
        {loading ? (<><Spinner className="h-4 w-4" /> در حال بررسی...</>) : "ورود"}
      </button>
      <button
        type="button"
        onClick={() => setStep("phone")}
        className="w-full text-xs text-ink-soft hover:text-coffee transition-colors"
      >
        تغییر شماره موبایل
      </button>
    </form>
  );
}
