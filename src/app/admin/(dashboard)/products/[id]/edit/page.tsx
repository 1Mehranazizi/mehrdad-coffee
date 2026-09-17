import { notFound } from "next/navigation";
import { getProductById, getProductVariants, listGrindOptions } from "@/server/repo/products";
import { listCategories } from "@/server/repo/categories";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const variants = getProductVariants(id);
  return <div><h1 className="text-2xl font-extrabold text-ink mb-6">ویرایش محصول</h1><ProductForm categories={listCategories()} grindOptions={listGrindOptions()} initial={{...product, variants}} /></div>;
}
