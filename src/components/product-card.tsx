import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductDTO } from "@/schemas/product";
import { LikeToggle } from "./products/like-toggle";
import { getImageSrcUrl } from "@/lib/storage/src";

function formatJPY(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

type Props = {
  product: ProductDTO;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: Props) {
  const src = getImageSrcUrl(product.imageUrl);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
      >
        {/* 画像領域：比率固定 & レスポンシブ最適化 */}
        <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={src}
            alt={product.name}
            fill
            className="object-cover"
            // 画面幅に応じて最適な画像サイズを配信（重要）
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        </div>
      </Link>

      {/* タイトルなど */}
      <CardHeader className="pb-2">
        <Link
          href={`/products/${product.id}`}
          className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
        >
          {/* モバイル1行、省スペース。広い画面では2行まで表示（line-clamp） */}
          <h2 className="text-base sm:text-lg font-medium line-clamp-1 sm:line-clamp-2">
            {product.name}
          </h2>
        </Link>
        <p className="text-sm text-muted-foreground">{product.categoryName}</p>
      </CardHeader>

      {/* 価格 & いいね */}
      <CardContent className="flex items-center justify-between">
        <span className="text-lg sm:text-xl font-semibold">
          ¥{formatJPY(product.price)}
        </span>

        <LikeToggle
          productId={product.id}
          initialCount={product.likeCount ?? 0}
          initialIsLiked={product.isLiked}
        />
      </CardContent>
    </Card>
  );
}
