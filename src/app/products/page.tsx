"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const toggleLike = (id: string) => setLiked((s) => ({ ...s, [id]: !s[id] }));

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/products", {
        cache: "no-store",
      });
      if (!res.ok) {
        console.error("failed to fetch products", await res.text());
        return;
      }
      const json = await res.json();
      setItems(json.items as Product[]);
    };
    load();
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
