"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "@/lib/toast-store";

export default function DeleteButton({
  endpoint,
  confirmMessage = "این مورد حذف شود؟",
}: {
  endpoint: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "حذف انجام نشد");
      }
      toast.success("با موفقیت حذف شد");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف انجام نشد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label="حذف"
      className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-red-700 transition-colors disabled:opacity-60"
    >
      <Trash2 size={16} />
    </button>
  );
}
