import { listCategories } from "@/server/categories";
import NewProductForm from "./product-form-client";

export const dynamic = "force-dynamic"; // Next.js App Router の「データキャッシュの制御」設定

export default async function NewProductPage() {
  const categories = await listCategories(); // CategoryDTO[]
  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">商品を新規作成</h1>
      <NewProductForm categories={categories} />
    </div>
  );
}
