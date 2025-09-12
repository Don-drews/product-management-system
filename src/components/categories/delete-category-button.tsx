"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteResponse = {
  message?: string;
  movedProductsCount?: number;
  deletedCategory?: { id: string; name: string; slug: string };
};

export default function DeleteCategoryButton({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // カテゴリの関連商品件数の状態
  const [count, setCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  const handleOpenChange = async (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) return;

    setCount(null);
    setCountLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}/count`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = (await res.json()) as { count?: number };
        setCount(typeof json.count === "number" ? json.count : 0);
      } else {
        setCount(null); // 失敗時は汎用メッセージにフォールバック
      }
    } catch {
      setCount(null);
    } finally {
      setCountLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as DeleteResponse;

      if (!res.ok) {
        // サーバー側の handleApiError のメッセージをそのまま表示
        alert(data?.message ?? "削除に失敗しました");
        return;
      }
      // console.log(`削除しました（移動 ${data.movedProductsCount ?? 0} 件）`);
      router.refresh();
    } catch {
      alert("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // ダイアログの説明文（件数に応じて切り替え）
  const description = (() => {
    if (countLoading) return <>関連商品数を取得中です…</>;
    if (count === null)
      return (
        <>
          このカテゴリに紐づく商品は<b>未分類</b>に移動した上で削除されます。
        </>
      );
    if (count === 0)
      return <>関連商品はありません。カテゴリのみ削除されます。</>;
    return (
      <>
        このカテゴリに紐づく商品 <b>{count}件</b> を<b>未分類</b>
        に移動した上で削除します。
      </>
    );
  })();

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={loading || disabled}
          title={disabled ? "未分類は削除できません" : "削除"}
        >
          {loading ? "削除中…" : "削除"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          {/* <AlertDialogDescription>
            この操作は取り消せません。
            <br />
            カテゴリに紐づく商品がある場合は「未分類」に変更になります。
          </AlertDialogDescription> */}
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={loading || countLoading}
          >
            {count !== null
              ? `削除する（移動 ${Math.max(0, count)} 件）`
              : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
