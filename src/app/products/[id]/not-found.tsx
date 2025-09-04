import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
      <h1 className="text-2xl font-bold">商品が見つかりませんでした</h1>
      <p className="text-sm text-muted-foreground">
        URLが間違っているか、商品が削除された可能性があります。
      </p>
      <Link href="/products" className="underline underline-offset-4">
        商品一覧へ戻る
      </Link>
    </div>
  );
}
