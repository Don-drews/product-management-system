"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@/types/product";
import SearchBar from "@/components/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export default function ProductsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // URLの ?q= から初期値を拾う
  const qInUrl = sp.get("q") ?? "";
  const [query, setQuery] = useState(qInUrl);
  const debounced = useDebounce(query, 300);

  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const toggleLike = (id: string) => setLiked((s) => ({ ...s, [id]: !s[id] }));

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // 入力が変わったらURLの q を更新（履歴を残す）
  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    router.push(`/products?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // useEffect(() => {
  //   const load = async () => {
  //     const res = await fetch("/api/products", {
  //       cache: "no-store",
  //     });
  //     if (!res.ok) {
  //       console.error("failed to fetch products", await res.text());
  //       return;
  //     }
  //     const json = await res.json();
  //     setItems(json.items as Product[]);
  //   };
  //   load();
  // }, []);

  // デバウンス後にAPIへ
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const url = debounced
          ? `/api/products?q=${encodeURIComponent(debounced)}`
          : "/api/products";
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setItems(json.items as Product[]);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          // 正常なキャンセル。無視
          // 修正前は入力が変わるたびに新しい fetch を投げ、前のリクエストを AbortController でキャンセルしています。その正常な中断が catch に入り、そこで console.error(e) していた
          return;
        }
        console.warn("fetch failed:", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [debounced]);

  const total = items.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          className="w-full sm:max-w-md"
        />
      </div>

      {loading && <p className="text-sm opacity-70">検索中…</p>}
      {!loading && total === 0 && (
        <p className="text-sm opacity-70">
          該当する商品が見つかりませんでした。
        </p>
      )}

      <ProductGrid products={items} liked={liked} onToggleLike={toggleLike} />
    </div>
  );
}
