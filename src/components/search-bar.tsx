"use client";

import { Input } from "@/components/ui/input"; // shadcn/ui を使う想定
import { Search } from "lucide-react";
import { cn } from "@/lib/cn"; // なければ className をそのまま渡してOK

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
        aria-hidden
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "商品名で検索"}
        className="pl-9"
        aria-label="商品検索"
      />
    </div>
  );
}
