import { ProductSchema, type ProductDTO } from "@/schemas/product";
import type { Product as PrismaProduct } from "@prisma/client";

export function toProductDTO(p: PrismaProduct): ProductDTO {
  return ProductSchema.parse({
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    price: p.price,
    imageUrl: p.imageUrl,
    categoryId: p.categoryId,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  });
}
