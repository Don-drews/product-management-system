"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import ProductGrid from "@/components/product-grid";
import SearchBar from "@/components/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductDTO } from "@/schemas/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryListItem } from "@/schemas/category";

export default function ProductsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // URLの ?q= から初期値を拾う
  const qInUrl = sp.get("q") ?? "";
  const [query, setQuery] = useState(qInUrl);

  const catInUrl = sp.get("category") ?? "";
  const [category, setCategory] = useState(catInUrl);
  const [categories, setCategories] = useState<CategoryListItem[]>([]);

  const debounced = useDebounce(query, 300);

  const [items, setItems] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        if (!abort) setCategories(json.items as CategoryListItem[]);
      } catch (e) {
        console.warn("fetch categories failed:", e);
      }
    })();
    return () => {
      abort = true;
    };
  }, []);

  // 入力が変わったらURLの q を更新
  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (query) params.set("q", query);
    else params.delete("q");

    if (category) params.set("category", category);
    else params.delete("category");

    // 履歴を汚したくなければ replace に
    router.replace(`/products?${params.toString()}`, { scroll: false });
    // ↓ 「useEffect 内で「外側のスコープから参照した値」を依存配列に入れろ」っていうeslintのreact-hooks/exhaustive-deps ルールを無効にしてくれる。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  // debounced（検索文字列）に変更があるたびにfetch
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debounced) params.set("q", debounced);
        if (category) params.set("category", category);

        const url = params.toString()
          ? `/api/products?${params.toString()}`
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
  }, [debounced, category]);

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
        <Select value={category} onValueChange={(val) => setCategory(val)}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="カテゴリーで絞り込み" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.slug || "all"} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
