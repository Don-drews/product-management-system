"use client";

import { useFormContext } from "react-hook-form";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/schemas/category";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormType = CreateCategoryInput | UpdateCategoryInput;

export default function CategoryFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <div className="space-y-4">
      {/* name */}
      <div className="space-y-2">
        <Label htmlFor="name">カテゴリ名</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">スラッグ</Label>
        <Input
          id="slug"
          placeholder="例: gadget, sports"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-sm text-red-600">{errors.slug.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          英小文字・数字・ハイフンのみ
        </p>
      </div>
    </div>
  );
}
