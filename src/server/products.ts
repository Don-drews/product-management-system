import { prisma } from "@/lib/prisma";
import { toProductDTO, type ProductWithCategory } from "@/lib/mapper/product";
import type {
  CreateProductInput,
  ProductDTO,
  UpdateProductInput,
} from "@/schemas/product";

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const productRecord = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });
  return productRecord
    ? toProductDTO(productRecord as ProductWithCategory)
    : null;
}

export async function listProducts(query?: string): Promise<ProductDTO[]> {
  const where = query
    ? { name: { contains: query, mode: "insensitive" as const } }
    : {};
  const rows = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });
  return rows.map((product) => toProductDTO(product as ProductWithCategory));
}

export async function createProduct(
  input: CreateProductInput
): Promise<ProductDTO> {
  const productRecord = await prisma.product.create({
    data: {
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      imageUrl: input.imageUrl,
      categoryId: input.categoryId,
    },
    include: { category: { select: { name: true } } },
  });

  return toProductDTO(productRecord);
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<ProductDTO | null> {
  const updated = await prisma.product
    .update({
      where: { id },
      data: {
        name: input.name,
        description: input.description ?? undefined,
        price: input.price,
        imageUrl: input.imageUrl,
        categoryId: input.categoryId,
      },
      include: { category: { select: { name: true } } },
    })
    .catch(() => null);

  return updated ? toProductDTO(updated as ProductWithCategory) : null;
}
