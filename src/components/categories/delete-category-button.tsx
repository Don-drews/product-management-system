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
  const [loading, setLoading] = useState(false);

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

  return (
    <AlertDialog>
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
          <AlertDialogDescription>
            この操作は取り消せません。
            <br />
            カテゴリに紐づく商品がある場合は「未分類」に変更になります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={loading}>
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
