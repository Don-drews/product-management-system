import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/server/products";
import type { Metadata } from "next";

function formatJPY(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

// タイトルを商品名に
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params; // ← まずawaitしてから取り出す
  const p = await getProductById(id);
  return {
    title: p ? `${p.name} | Products` : "商品が見つかりません | Products",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // 受け取りをPromiseに
}) {
  const { id } = await params; // ← まずawaitしてから取り出す
  const p = await getProductById(id);
  if (!p) notFound();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Detail</h1>
        <Link href="/products" className="text-sm underline underline-offset-4">
          一覧に戻る
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 画像 */}
        <div className="relative aspect-square overflow-hidden rounded-xl border">
          <Image
            src={p.imageUrl || "/placeholder/gadget.png"}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* 詳細情報 */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">{p.name}</h2>
          <div className="text-2xl font-bold">¥{formatJPY(p.price)}</div>
          {p.description && (
            <p className="text-sm leading-6 opacity-90">{p.description}</p>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <div>カテゴリID: {p.categoryId}</div>
            <div>作成: {new Date(p.createdAt).toLocaleString("ja-JP")}</div>
            <div>更新: {new Date(p.updatedAt).toLocaleString("ja-JP")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
