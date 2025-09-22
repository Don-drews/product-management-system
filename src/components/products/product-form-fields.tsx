"use client";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";
import { getProductImageUrl } from "@/lib/storage/url";
import { uploadProductImage } from "@/lib/storage/client";

type CategoryOption = { id: string; name: string };

export default function ProductFormFields({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();
  const imageUrl: string | undefined = watch("imageUrl");
  const [uploading, setUploading] = useState(false);

  const previewSrc = useMemo(() => {
    if (!imageUrl) return "";
    // すでに完全なURLならそのまま、pathなら公開URLに変換
    const isFull = /^https?:\/\//i.test(imageUrl);
    return isFull ? imageUrl : getProductImageUrl(imageUrl);
  }, [imageUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadProductImage(file); // ← ここでSupabaseへ直PUT & path取得
      setValue("imageUrl", path, { shouldValidate: true, shouldDirty: true });
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

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

      {/* 画像アップロード */}
      <div className="space-y-2">
        <Label htmlFor="imageFile">商品画像</Label>
        <Input
          id="imageFile"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
        {/* hiddenで imageUrl をフォーム値に保持（送信用） */}
        <input type="hidden" {...register("imageUrl")} />
        {uploading && (
          <p className="text-sm text-muted-foreground">アップロード中…</p>
        )}
        {errors?.imageUrl && (
          <p className="text-sm text-red-600">
            {String(errors.imageUrl.message)}
          </p>
        )}
        {!!previewSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
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
