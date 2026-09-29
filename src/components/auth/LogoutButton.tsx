"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast-store";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          toast.success("از حساب کاربری خارج شدید");
        } catch {
          toast.error("خروج از حساب با خطا مواجه شد");
          return;
        }
        router.push("/");
        router.refresh();
      }}
      className="text-sm text-ink-soft hover:text-coffee transition-colors"
    >
      خروج
    </button>
  );
}
