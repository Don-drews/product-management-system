"use client";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import ProductFormFields from "@/components/products/product-form-fields";
import {
  UpdateProductSchema,
  type UpdateProductInput,
  type ProductDTO,
} from "@/schemas/product";
import { CategoryOption } from "@/schemas/category";

type Props = {
  product: ProductDTO;
  categories: CategoryOption[];
};

type DirtyFlags<T> = Partial<Record<keyof T, boolean>>;
function pickDirty<T extends Record<string, unknown>>(
  all: T,
  dirty: DirtyFlags<T>
): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(dirty) as (keyof T)[]).forEach((k) => {
    if (dirty[k]) out[k] = all[k];
  });
  return out;
}

export default function EditProductForm({ product, categories }: Props) {
  const router = useRouter();

  const form = useForm<UpdateProductInput>({
    resolver: zodResolver(UpdateProductSchema), // 全項目 optional
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    },
  });

  const onSubmit: SubmitHandler<UpdateProductInput> = async () => {
    const { isDirty, dirtyFields } = form.formState;
    if (!isDirty) {
      alert("変更はありません");
      return;
    }

    const patch = pickDirty(form.getValues(), dirtyFields);
    if (patch.price != null) {
      patch.price = Number(patch.price) as UpdateProductInput["price"];
    }

    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT", // 部分更新でも運用上PUT/PATCHどちらでもOK
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (!res.ok) {
      alert("更新に失敗しました");
      return;
    }

    router.push(`/products/${product.id}`);
    router.refresh();
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <ProductFormFields categories={categories} />
        <div className="flex gap-2">
          <Button type="submit" disabled={!form.formState.isDirty}>
            更新する
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
