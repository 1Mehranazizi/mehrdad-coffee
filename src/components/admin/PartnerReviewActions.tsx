"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/admin/Modal";
import Spinner from "@/components/Spinner";
import { toast } from "@/lib/toast-store";
import type { PartnerStatus } from "@/lib/partner";

export default function PartnerReviewActions({
  id,
  status,
}: {
  id: string;
  status: PartnerStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [note, setNote] = useState("");

  const decide = async (decision: "APPROVED" | "REJECTED", adminNote?: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note: adminNote }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "عملیات انجام نشد");
      toast.success(decision === "APPROVED" ? "همکار تأیید شد و قیمت همکار فعال شد" : "درخواست رد شد");
      setRejectOpen(false);
      setNote("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "عملیات انجام نشد");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {status !== "APPROVED" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => decide("APPROVED")}
            className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {busy && <Spinner className="h-3 w-3" />}
            تأیید همکار
          </button>
        )}
        {status !== "REJECTED" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setRejectOpen(true)}
            className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {status === "APPROVED" ? "لغو همکاری" : "رد درخواست"}
          </button>
        )}
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title={status === "APPROVED" ? "لغو همکاری" : "رد درخواست"}
      >
        <label className="text-sm text-ink-soft">دلیل (به مشتری نمایش داده می‌شود)</label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setRejectOpen(false)}
            className="rounded-full px-4 py-2 text-sm text-ink-soft hover:bg-paper-deep"
          >
            انصراف
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => decide("REJECTED", note)}
            className="flex items-center gap-1.5 rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
          >
            {busy && <Spinner className="h-3 w-3" />}
            تأیید {status === "APPROVED" ? "لغو" : "رد"}
          </button>
        </div>
      </Modal>
    </>
  );
}
