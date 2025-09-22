// loading.tsxはローディング時に自動で表示されるUI。
// ページやレイアウトのコンポーネントが 非同期処理でレンダリングを待っている間に自動表示される。

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <div className="h-6 w-40 bg-muted animate-pulse rounded mb-4" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square bg-muted animate-pulse rounded" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-5 w-1/2 bg-muted animate-pulse rounded" />
          <div className="h-24 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
