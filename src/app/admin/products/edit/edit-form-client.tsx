"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UpdateProductSchema,
  type UpdateProductInput,
  type ProductDTO,
} from "@/schemas/product";
import type { CategoryDTO } from "@/schemas/category";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  product: ProductDTO;
  categories: CategoryDTO[];
};

// dirtyFields から差分だけを取り出すユーティリティ
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

export default function EditProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
    getValues,
    watch,
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(UpdateProductSchema), // ← Update（全部optional）
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      price: Number(product.price),
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async () => {
    if (!isDirty) {
      alert("変更はありません");
      return;
    }
    const values = getValues(); // 現在のフォーム全値
    const patch = pickDirty(values, dirtyFields); // 変更されたキーだけ抽出

    // 価格を数値化（dirty なら patch に入っている可能性あり）
    if (patch.price != null) {
      patch.price = Number(patch.price) as UpdateProductInput["price"];
    }

    // 業務ポリシーに応じて空文字→nullにしたいならここで正規化
    // if (patch.description === "") patch.description = null as any;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        console.error("Update failed:", detail);
        alert("更新に失敗しました");
        return;
      }

      router.push(`/products/${product.id}`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const categoriesEmpty = categories.length === 0;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* 商品名 */}
      <div className="space-y-2">
        <Label htmlFor="name">商品名</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* 説明 */}
      <div className="space-y-2">
        <Label htmlFor="description">説明</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* 価格 */}
      <div className="space-y-2">
        <Label htmlFor="price">価格（円）</Label>
        <Input
          id="price"
          type="number"
          inputMode="numeric"
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* 画像URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">画像URL（相対 or 絶対）</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
        {errors.imageUrl && (
          <p className="text-sm text-red-600">
            {String(errors.imageUrl.message)}
          </p>
        )}
        {!!imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="preview"
            className="mt-2 h-32 w-auto rounded border object-cover"
          />
        )}
      </div>

      {/* カテゴリ */}
      <div className="space-y-2">
        <Label htmlFor="categoryId">カテゴリ</Label>
        <select
          id="categoryId"
          className="block w-full rounded-md border px-3 py-2 bg-background"
          {...register("categoryId")}
          disabled={categoriesEmpty}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {categoriesEmpty && (
          <p className="text-sm text-amber-600">
            カテゴリがありません。先にカテゴリを作成してください。
          </p>
        )}
        {errors.categoryId && (
          <p className="text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      {/* アクション */}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={submitting || categoriesEmpty || !isDirty}
        >
          {submitting ? "更新中..." : "更新する"}
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
  );
}
