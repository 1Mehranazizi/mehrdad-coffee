"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "@/lib/toast-store";

type Status = "can-review" | "not-logged-in" | "not-purchased" | "already-reviewed";

export default function ReviewForm({
  productId,
  status,
}: {
  productId: string;
  status: Status;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (status === "not-logged-in") {
    return (
      <p className="text-sm text-ink-soft">
        برای ثبت نظر ابتدا{" "}
        <Link href="/login" className="text-coffee hover:text-coffee-deep">
          وارد حساب کاربری
        </Link>{" "}
        شوید.
      </p>
    );
  }

  if (status === "not-purchased") {
    return (
      <p className="text-sm text-ink-soft">
        فقط مشتریانی که این محصول را خریده‌اند می‌توانند نظر ثبت کنند.
      </p>
    );
  }

  if (status === "already-reviewed" || result === "success") {
    return (
      <p className="text-sm text-ink-soft">
        نظر شما ثبت شد و پس از تایید مدیر نمایش داده می‌شود. ممنون از وقتی که
        گذاشتید 🙏
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 3) {
      setResult("error");
      setErrorMsg("لطفاً نظر خود را کمی کامل‌تر بنویسید.");
      toast.error("لطفاً نظر خود را کمی کامل‌تر بنویسید.");
      return;
    }
    setSubmitting(true);
    setResult("idle");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult("error");
        setErrorMsg(data.error || "ثبت نظر با خطا مواجه شد.");
        toast.error(data.error || "ثبت نظر با خطا مواجه شد.");
        return;
      }
      setResult("success");
      toast.success("نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود");
    } catch {
      setResult("error");
      setErrorMsg("ارتباط با سرور برقرار نشد.");
      toast.error("ارتباط با سرور برقرار نشد.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`امتیاز ${n} از ۵`}
          >
            <Star
              size={22}
              className={
                n <= (hoverRating || rating)
                  ? "fill-brass text-brass"
                  : "text-line"
              }
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="نظر خود را درباره‌ی این محصول بنویسید..."
        rows={3}
        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-coffee"
      />
      {result === "error" && (
        <p className="text-sm text-red-700">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
      >
        {submitting ? "در حال ارسال..." : "ثبت نظر"}
      </button>
    </form>
  );
}
