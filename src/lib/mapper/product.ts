import { ProductSchema, type ProductDTO } from "@/schemas/product";
import type { Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: { select: { name: true } } };
}>;

export function toProductDTO(
  p: ProductWithCategory,
  opts?: { likeCount?: number; isLiked?: boolean }
): ProductDTO {
  return ProductSchema.parse({
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    price: p.price,
    imageUrl: p.imageUrl,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? "カテゴリ未設定",
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    ...(typeof opts?.likeCount === "number"
      ? { likeCount: opts.likeCount }
      : {}),
    ...(typeof opts?.isLiked === "boolean" ? { isLiked: opts.isLiked } : {}),
  });
}
