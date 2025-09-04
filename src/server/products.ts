import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mapper/product";
import type { ProductDTO } from "@/schemas/product";

export async function getProductById(id: string): Promise<ProductDTO | null> {
  const p = await prisma.product.findUnique({ where: { id } });
  return p ? toProductDTO(p) : null;
}

export async function listProducts(q?: string): Promise<ProductDTO[]> {
  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};
  const rows = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProductDTO);
}
