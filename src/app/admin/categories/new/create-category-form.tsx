"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  CreateCategorySchema,
  type CreateCategoryInput,
} from "@/schemas/category";
import CategoryFormFields from "@/components/categories/category-form-fields";

export default function CreateCategoryForm() {
  const router = useRouter();

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: { name: "", slug: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      console.error("Create category failed:", detail);
      alert("カテゴリ作成に失敗しました");
      return;
    }

    router.push("/admin/categories"); // 一覧へ（無ければ後で作成）
    router.refresh();
  });

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <CategoryFormFields />
        <div className="flex gap-2">
          <Button type="submit">作成する</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            キャンセル
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
