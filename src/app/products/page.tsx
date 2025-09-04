"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import ProductGrid from "@/components/product-grid";
import products from "@/mocks/products.json";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const toggleLike = (id: string) => setLiked((s) => ({ ...s, [id]: !s[id] }));

  // 並び：新しい順（createdAtが無ければidでタイブレーク）
  const items = useMemo(() => {
    const list = products as Product[];
    return [...list].sort((a, b) =>
      (b.createdAt ?? b.id).localeCompare(a.createdAt ?? a.id)
    );
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <ThemeToggle />
      </div>

      <ProductGrid products={items} liked={liked} onToggleLike={toggleLike} />
    </div>
  );
}
