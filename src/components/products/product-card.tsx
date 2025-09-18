import Image from "next/image";
import Link from "next/link";
// import { Heart } from "lucide-react";
import type { ProductCardData } from "@/types/product";
import { LikeToggle } from "./like-toggle";

type Props = { product: ProductCardData };

export default function ProductCard({ product }: Props) {
  return (
    <div className="group relative rounded-2xl border bg-card p-3 shadow-sm">
      {/* 画像 */}
      <Link
        href={`/products/${product.id}`}
        className="block overflow-hidden rounded-xl"
      >
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
        </div>
      </Link>

      {/* 下段 */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/products/${product.id}`}
            className="block truncate text-sm font-medium hover:underline"
            title={product.name}
          >
            {product.name}
          </Link>
          <div className="text-xs text-muted-foreground mt-0.5">
            ¥{product.price.toLocaleString()}
          </div>
        </div>

        {/* 右上：いいね（後でClient後載せに差し替え） */}
        {/* <div className="flex items-center gap-1 text-xs tabular-nums">
          <Heart className="h-4 w-4" aria-hidden />
          {product.likeCount}
        </div> */}
        <LikeToggle
          productId={product.id}
          initialCount={product.likeCount}
          // initialIsLiked は後で一括取得を入れる
        />
      </div>

      {/* 角の軽い装飾（任意） */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-primary/20" />
    </div>
  );
}
