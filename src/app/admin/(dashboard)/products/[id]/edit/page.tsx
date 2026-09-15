import { notFound } from "next/navigation";
import { getProductById } from "@/server/repo/products";
import { listCategories } from "@/server/repo/categories";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const categories = listCategories();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">ویرایش محصول</h1>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
