"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore, type ToastType } from "@/lib/toast-store";

const styles: Record<ToastType, { box: string; icon: React.ReactNode }> = {
  success: {
    box: "border-emerald-300 bg-emerald-50 text-emerald-900",
    icon: <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />,
  },
  error: {
    box: "border-red-300 bg-red-50 text-red-900",
    icon: <AlertCircle size={18} className="shrink-0 text-red-600" />,
  },
  info: {
    box: "border-line bg-cream text-ink",
    icon: <Info size={18} className="shrink-0 text-coffee" />,
  },
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === "error" ? "alert" : "status"}
          className={`toast-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${styles[t.type].box}`}
        >
          {styles[t.type].icon}
          <p className="flex-1 leading-6">{t.message}</p>
          <button
            type="button"
            aria-label="بستن"
            onClick={() => dismiss(t.id)}
            className="mt-0.5 shrink-0 opacity-60 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
