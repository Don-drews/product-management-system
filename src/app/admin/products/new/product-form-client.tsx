import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryDTO } from "@/schemas/category";
import { CreateProductInput, CreateProductSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewProductForm({
  categories,
}: {
  categories: CategoryDTO[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "/placeholder/no-image.png",
      categoryId: categories[0]?.id ?? "",
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (values: CreateProductInput) => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, price: Number(values.price) }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        console.error("Create failed:", detail);
        alert("作成に失敗しました");
        return;
      }
      router.push("/products");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* 簡易プレビュー（任意） */}
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
        {errors.categoryId && (
          <p className="text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      {/* アクション */}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "作成中..." : "作成する"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
