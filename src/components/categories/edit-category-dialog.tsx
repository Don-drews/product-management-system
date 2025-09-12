"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UpdateCategorySchema,
  UpdateCategoryInput,
  CategoryListItem,
} from "@/schemas/category";

import CategoryFormFields from "./category-form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// 変更のあったフィールドだけ送る（実務寄せ）
function pickDirty<T extends Record<string, unknown>>(
  allValues: T,
  dirty: Partial<Record<keyof T, boolean>>
): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(dirty) as Array<keyof T>).forEach((k) => {
    if (dirty[k]) out[k] = allValues[k];
  });
  return out;
}

export default function EditCategoryDialog({
  category,
}: {
  category: CategoryListItem;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(UpdateCategorySchema), // 全項目 optional
    defaultValues: {
      name: category.name,
      slug: category.slug,
    },
  });

  const onSubmit = form.handleSubmit(async () => {
    const patch = pickDirty(form.getValues(), form.formState.dirtyFields);
    if (Object.keys(patch).length === 0) {
      setOpen(false);
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        console.error("Update category failed:", detail);
        alert("更新に失敗しました");
        return;
      }
      setOpen(false);
      router.refresh(); // 一覧を最新に
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 h-auto">
          編集
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>カテゴリを編集</DialogTitle>
          <DialogDescription>名前とスラッグを更新できます。</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <CategoryFormFields />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={submitting || !form.formState.isDirty}
              >
                {submitting ? "更新中..." : "更新する"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
