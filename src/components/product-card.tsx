import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";

function formatJPY(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

type Props = {
  product: Product;
  liked: boolean;
  onToggleLike: () => void;
};

export default function ProductCard({ product, liked, onToggleLike }: Props) {
  // 画像が無いときのフォールバック（任意）
  const img = product.imageUrl || "/placeholder/no-image.png";

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
      >
        {/* 画像領域：比率固定 & レスポンシブ最適化 */}
        <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover"
            // 画面幅に応じて最適な画像サイズを配信（重要）
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
        </div>

        {/* タイトルなど */}
        <CardHeader className="pb-2">
          {/* モバイル1行、省スペース。広い画面では2行まで表示（line-clamp） */}
          <h2 className="text-base sm:text-lg font-medium line-clamp-1 sm:line-clamp-2">
            {product.name}
          </h2>
        </CardHeader>

        {/* 価格 & いいね */}
        <CardContent className="flex items-center justify-between">
          <span className="text-lg sm:text-xl font-semibold">
            ¥{formatJPY(product.price)}
          </span>

          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            onClick={onToggleLike}
            aria-pressed={liked}
            aria-label={liked ? "いいね解除" : "いいね"}
            className="gap-1 h-9"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
