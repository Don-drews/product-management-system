"use client";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import ProductFormFields from "@/components/products/product-form-fields";
import {
  CreateProductSchema,
  type CreateProductInput,
} from "@/schemas/product";
import { CategoryOption } from "@/schemas/category";

export default function CreateProductForm({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      categoryId: categories[0]?.id ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      alert("作成に失敗しました");
      return;
    }

    const { item } = await res.json();
    router.push(`/products/${item.id}`);
    router.refresh();
  });

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <ProductFormFields categories={categories} />
        <div className="flex gap-2">
          <Button type="submit">作成する</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/products")}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
