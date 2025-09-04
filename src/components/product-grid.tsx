import type { Product } from "@/types/product";
import ProductCard from "@/components/product-card";

type Props = {
  products: Product[];
  liked: Record<string, boolean>;
  onToggleLike: (id: string) => void;
};

export default function ProductGrid({ products, liked, onToggleLike }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          liked={!!liked[p.id]}
          onToggleLike={() => onToggleLike(p.id)}
        />
      ))}
    </div>
  );
}
