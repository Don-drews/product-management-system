import Link from "next/link";
import { listCategories } from "@/server/categories";

// 必要ならメタタイトル
export const metadata = { title: "カテゴリ一覧 | Admin" };

export default async function AdminCategoriesPage() {
  // サーバー側で直接サービス層を呼ぶ（API経由にしなくてOK）
  const items = await listCategories();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">カテゴリ一覧</h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          新規作成
        </Link>
      </div>

      {/* 空表示 */}
      {items.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          まだカテゴリがありません。右上の「新規作成」から追加してください。
        </div>
      ) : (
        // シンプルなテーブル（shadcn/ui の Table を入れていない想定で生HTML）
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">名前</th>
                <th className="px-4 py-3 font-medium">スラッグ</th>
                <th className="px-4 py-3 font-medium w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="text-primary underline underline-offset-4 hover:opacity-90"
                    >
                      編集
                    </Link>
                    {/* 削除は後で AlertDialog 付きで足す */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
