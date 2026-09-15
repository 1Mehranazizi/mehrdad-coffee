"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
      await fetch(endpoint, { method: "DELETE" });
      router.refresh();
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
