import { listCategories } from "@/server/repo/categories";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const categories = listCategories();
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">محصول جدید</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
