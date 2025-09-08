"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // ログ出しやエラートラッキング
  useEffect(() => {
    console.error("❌ Product detail error:", error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
      <h1 className="text-2xl font-bold">エラーが発生しました</h1>
      <p className="text-sm text-muted-foreground">
        商品情報の取得中に問題が発生しました。しばらくしてから再度お試しください。
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
      >
        再読み込み
      </button>
    </div>
  );
}
