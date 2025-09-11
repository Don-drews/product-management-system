"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/search-bar";
import { useDebounce } from "@/hooks/use-debounce";

export default function SearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (debounced) params.set("q", debounced);
    else params.delete("q");
    // 履歴を汚したくない場合は replace
    router.replace(`/admin/categories?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="flex items-center gap-3">
      <SearchBar
        value={query}
        onChange={setQuery}
        className="w-full sm:max-w-md"
        placeholder="カテゴリ名・スラッグで検索"
      />
    </div>
  );
}
