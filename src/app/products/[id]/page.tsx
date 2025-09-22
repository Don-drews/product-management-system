import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/server/products";
import type { Metadata } from "next";
import { getProductImageUrl } from "@/lib/storage/url";
import { auth } from "@/auth";

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
  const session = await auth();
  const { id } = await params; // ← まずawaitしてから取り出す
  const product = await getProductById(id);
  if (!product) notFound(); // notFound()は同じフォルダ階層の"not-found.tsx"が呼ばれる。なければ上の階層のnot-found.tsxが呼ばれる（親ディレクトリを順番に探していく 仕組み）
  const src = product.imageUrl
    ? /^https?:\/\//i.test(product.imageUrl)
      ? product.imageUrl // すでにフルURLならそのまま
      : getProductImageUrl(product.imageUrl) // pathなら公開URLへ変換
    : "/placeholder/no-image.png";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Detail</h1>
        <Link href="/products" className="text-sm underline underline-offset-4">
          一覧に戻る
        </Link>
        {session && (
          <Link
            href="/favorites"
            className="text-sm underline underline-offset-4"
          >
            お気に入り一覧へ
          </Link>
        )}
        {session && session?.user.role === "ADMIN" && (
          <Link
            href={`/admin/products/${id}/edit`}
            className="text-sm underline underline-offset-4"
          >
            編集する
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 画像 */}
        <div className="relative aspect-square overflow-hidden rounded-xl border">
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* 詳細情報 */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">{product.name}</h2>
          <p className="text-sm text-muted-foreground">
            {product.categoryName}
          </p>
          <div className="text-2xl font-bold">¥{formatJPY(product.price)}</div>
          {product.description && (
            <p className="text-sm leading-6 opacity-90">
              {product.description}
            </p>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <div>カテゴリID: {product.categoryId}</div>
            <div>
              作成: {new Date(product.createdAt).toLocaleString("ja-JP")}
            </div>
            <div>
              更新: {new Date(product.updatedAt).toLocaleString("ja-JP")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
