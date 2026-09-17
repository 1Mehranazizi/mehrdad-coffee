import VariableManager from "@/components/admin/VariableManager";
import { listGrindOptions } from "@/server/repo/products";

export default function ProductVariablesPage() {
  return <div><div className="mb-7"><p className="text-xs font-semibold tracking-[0.2em] text-coffee">PRODUCT SETTINGS</p><h1 className="mt-1 text-2xl font-extrabold text-ink">مدیریت متغیرهای محصول</h1><p className="mt-2 text-sm text-ink-soft">انواع آسیاب را یک‌بار تعریف کنید و هنگام ساخت هر محصول از آن‌ها استفاده کنید.</p></div><VariableManager initial={listGrindOptions()} /></div>;
}
