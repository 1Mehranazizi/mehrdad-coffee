"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Star, Trash2, X } from "lucide-react";
import { toast } from "@/lib/toast-store";

type Review = {
  id: string;
  productName: string;
  customerName: string | null;
  rating: number;
  comment: string;
  approved: boolean;
};

export default function ReviewModerationRow({ review }: { review: Review }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const act = async (action: "approve" | "reject" | "delete") => {
    setLoading(true);
    try {
      const res =
        action === "delete"
          ? await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" })
          : await fetch(`/api/admin/reviews/${review.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ approved: action === "approve" }),
            });
      if (!res.ok) throw new Error("عملیات انجام نشد");
      toast.success(
        action === "delete" ? "نظر حذف شد" : action === "approve" ? "نظر تأیید شد" : "نظر رد شد"
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "عملیات انجام نشد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-cream p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-ink">{review.productName}</p>
          <p className="text-xs text-ink-soft">
            {review.customerName || "مشتری"} ·{" "}
            <span className={review.approved ? "text-coffee-deep" : "text-amber-700"}>
              {review.approved ? "تایید شده" : "در انتظار تایید"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-0.5" dir="ltr">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? "fill-brass text-brass" : "text-line"}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-soft leading-7">{review.comment}</p>
      <div className="mt-4 flex items-center gap-2">
        {!review.approved && (
          <button
            onClick={() => act("approve")}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
          >
            <Check size={14} />
            تایید و نمایش
          </button>
        )}
        {review.approved && (
          <button
            onClick={() => act("reject")}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs text-ink-soft hover:border-coffee transition-colors disabled:opacity-60"
          >
            <X size={14} />
            پنهان کردن
          </button>
        )}
        <button
          onClick={() => act("delete")}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs text-ink-soft hover:border-red-700 hover:text-red-700 transition-colors disabled:opacity-60"
        >
          <Trash2 size={14} />
          حذف
        </button>
      </div>
    </div>
  );
}
