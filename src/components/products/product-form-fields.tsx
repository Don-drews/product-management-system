"use client";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CategoryOption = { id: string; name: string };

export default function ProductFormFields({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const imageUrl: string | undefined = watch("imageUrl");

  return (
    <>
      {/* 商品名 */}
      <div className="space-y-2">
        <Label htmlFor="name">商品名</Label>
        <Input id="name" {...register("name")} />
        {errors?.name && (
          <p className="text-sm text-red-600">{String(errors.name.message)}</p>
        )}
      </div>

      {/* 説明 */}
      <div className="space-y-2">
        <Label htmlFor="description">説明</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors?.description && (
          <p className="text-sm text-red-600">
            {String(errors.description.message)}
          </p>
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
        {errors?.price && (
          <p className="text-sm text-red-600">{String(errors.price.message)}</p>
        )}
      </div>

      {/* 画像URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">画像URL（相対 or 絶対）</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
        {errors?.imageUrl && (
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
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors?.categoryId && (
          <p className="text-sm text-red-600">
            {String(errors.categoryId.message)}
          </p>
        )}
      </div>
    </>
  );
}
