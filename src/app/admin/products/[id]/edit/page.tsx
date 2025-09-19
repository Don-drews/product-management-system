import { notFound } from "next/navigation";
import { getProductById } from "@/server/products";
import { listCategories } from "@/server/categories";
import EditProductForm from "./edit-form-client";
import DeleteProductButton from "@/components/products/delete-product-button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  // 商品 + カテゴリ一覧を並列取得
  const [product, categories] = await Promise.all([
    getProductById(id),
    listCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">商品を編集</h1>
      <DeleteProductButton id={id} />
      <EditProductForm product={product} categories={categories} />
    </div>
  );
}
