import { listGrindTypes } from "@/server/repo/grind-types";
import GrindTypesClient from "@/components/admin/GrindTypesClient";

export default function AdminGrindTypesPage() {
  const grindTypes = listGrindTypes();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-2">متغیرهای محصول</h1>
      <p className="text-sm text-ink-soft mb-6">
        انواع آسیاب که هنگام تعریف محصولات دسته‌ی «قهوه» قابل انتخاب هستند.
      </p>
      <GrindTypesClient initial={grindTypes} />
    </div>
  );
}
