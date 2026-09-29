"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { toast } from "@/lib/toast-store";

type GrindType = { id: string; title: string; sortOrder: number };

export default function GrindTypesClient({ initial }: { initial: GrindType[] }) {
  const [items, setItems] = useState(initial);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/admin/grind-types");
    const data = await res.json();
    setItems(data.grindTypes || []);
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/grind-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "افزودن انجام نشد");
      toast.success("گزینه اضافه شد");
      setNewTitle("");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "افزودن انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async (id: string) => {
    if (!editingTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/grind-types/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "ویرایش انجام نشد");
      toast.success("گزینه ویرایش شد");
      setEditingId(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ویرایش انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("این گزینه حذف شود؟ اگر محصولی از آن استفاده کند ممکن است دچار مشکل شود.")) return;
    try {
      const res = await fetch(`/api/admin/grind-types/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "حذف انجام نشد");
      toast.success("گزینه حذف شد");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف انجام نشد");
    }
  };

  return (
    <div className="max-w-md space-y-3">
      {items.map((item) =>
        editingId === item.id ? (
          <div key={item.id} className="flex items-center gap-2">
            <input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="flex-1 rounded-xl border border-line bg-cream px-4 py-2 text-sm focus:border-coffee"
              autoFocus
            />
            <button
              onClick={() => handleRename(item.id)}
              disabled={saving}
              className="p-2 rounded-full hover:bg-paper-deep text-coffee"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="p-2 rounded-full hover:bg-paper-deep text-ink-soft"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-line bg-cream px-4 py-2.5"
          >
            <span className="text-sm text-ink">{item.title}</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setEditingId(item.id);
                  setEditingTitle(item.title);
                }}
                className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-ink"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )
      )}

      <div className="flex items-center gap-2 pt-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="مثلاً: اسپرسو، فرنچ‌پرس، موکاپات"
          className="flex-1 rounded-xl border border-dashed border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
        >
          <Plus size={16} />
          افزودن
        </button>
      </div>
    </div>
  );
}
