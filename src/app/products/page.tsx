"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import ProductGrid from "@/components/product-grid";
import SearchBar from "@/components/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductDTO } from "@/schemas/product";

export default function ProductsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // URLの ?q= から初期値を拾う
  const qInUrl = sp.get("q") ?? "";
  const [query, setQuery] = useState(qInUrl);
  const debounced = useDebounce(query, 300);

  const [items, setItems] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // 入力が変わったらURLの q を更新
  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (query) params.set("q", query);
    else params.delete("q"); // 検索バーになにも入力されていない場合はURLから"q"を削除し、"/products?q="のようなからクエリを残さない。
    router.push(`/products?${params.toString()}`); // push は履歴を1件積むので、検索中に1文字入力するたびに「戻るボタン」で1文字ずつ戻れる状態になる（これは好み。履歴を汚したくないなら router.replace(...) もアリ）。
    // ↓ 「useEffect 内で「外側のスコープから参照した値」を依存配列に入れろ」っていうeslintのreact-hooks/exhaustive-deps ルールを無効にしてくれる。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // debounced（検索文字列）に変更があるたびにfetch
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
        setItems(json.items as ProductDTO[]);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.warn("fetch failed:", e);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [debounced]);

  const total = items.length;

  items.map((product) => {
    console.log(`product.likeCount:${product.likeCount}`);
  });

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

      <ProductGrid products={items} />
    </div>
  );
}
