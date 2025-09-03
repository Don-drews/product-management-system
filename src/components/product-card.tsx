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
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <CardHeader className="pb-2">
        <h2 className="text-base font-medium line-clamp-1">{product.name}</h2>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <span className="text-lg font-semibold">
          ¥{formatJPY(product.price)}
        </span>
        <Button
          variant={liked ? "default" : "outline"}
          size="sm"
          onClick={onToggleLike}
          aria-pressed={liked}
          aria-label={liked ? "いいね解除" : "いいね"}
          className="gap-1"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {liked ? "Liked" : "Like"}
        </Button>
      </CardContent>
    </Card>
  );
}
