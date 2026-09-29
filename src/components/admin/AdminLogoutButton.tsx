"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "@/lib/toast-store";

export default function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        try {
          await fetch("/api/admin/logout", { method: "POST" });
          toast.success("از پنل مدیریت خارج شدید");
        } catch {
          toast.error("خروج با خطا مواجه شد");
          return;
        }
        router.push("/admin/login");
        router.refresh();
      }}
      className="flex items-center gap-2 text-sm text-ink-soft hover:text-red-700 transition-colors"
    >
      <LogOut size={16} />
      خروج
    </button>
  );
}
