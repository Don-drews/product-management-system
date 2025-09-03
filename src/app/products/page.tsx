"use client";

import ThemeToggle from "@/components/theme-toggle";
import ProductCard from "@/components/product-card";
import type { Product } from "@/types/product";

const dummy: Product = {
  id: "p-001",
  name: "Wireless Earbuds",
  description: "コンパクトで高音質な完全ワイヤレスイヤホン",
  price: 9800,
  imageUrl: "/placeholder/no-image.png",
  categoryId: "c-gadget",
  createdAt: "2025-09-01T10:00:00Z",
  updatedAt: "2025-09-01T10:00:00Z",
};

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <ThemeToggle />
      <p>ここに商品一覧を作る予定</p>
      <div className="max-w-xs">
        <ProductCard
          product={dummy}
          liked={false}
          onToggleLike={() => console.log("toggle like")}
        />
      </div>
    </div>
  );
}
