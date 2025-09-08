import { prisma } from "@/lib/prisma";
import { toProductDTO, type ProductWithCategory } from "@/lib/mapper/product";
import type { ProductDTO } from "@/schemas/product";

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const p = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });
  return p ? toProductDTO(p as ProductWithCategory) : null;
}

export async function listProducts(q?: string): Promise<ProductDTO[]> {
  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};
  const rows = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });
  return rows.map((r) => toProductDTO(r as ProductWithCategory));
}
