import { prisma } from "@/lib/prisma";
import { toProductDTO, type ProductWithCategory } from "@/lib/mapper/product";
import type {
  CreateProductInput,
  ProductDTO,
  UpdateProductInput,
} from "@/schemas/product";
import { ProductCardData } from "@/types/product";

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
    include: {
      category: { select: { name: true } },
      _count: { select: { likes: true } },
    },
  });
  return rows.map((product) =>
    toProductDTO(product as ProductWithCategory, {
      likeCount: product._count.likes,
    })
  );
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

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

/**
 * 新着（createdAt desc, limit=12）
 * - likeCount は累計（Product.likes の総数）
 */
export async function getNewArrivals(limit = 12): Promise<ProductCardData[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      createdAt: true,
      _count: { select: { likes: true } },
    },
  });

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt,
    likeCount: p._count.likes,
  }));
}

/**
 * 人気（直近7日いいね数 desc, limit=8）
 * - likeCount は直近7日の数
 */
export async function getPopularIn7Days(limit = 8): Promise<ProductCardData[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 今の時間から 7日分を引いて「7日前の日時」を since として保存

  const grouped = await prisma.like.groupBy({
    by: ["productId"],
    where: { createdAt: { gte: since } },
    _count: { productId: true },
    orderBy: { _count: { productId: "desc" } },
    take: limit,
  });

  if (grouped.length === 0) return []; // もし直近7日間に1件もいいねがなかった場合は、余計な処理をせずに空配列を返す

  const ids = grouped.map((g) => g.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      createdAt: true,
    },
  });

  const countMap = new Map(
    grouped.map((g) => [g.productId, g._count.productId])
  );
  const orderMap = new Map(ids.map((id, idx) => [id, idx]));

  const merged: ProductCardData[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt,
    likeCount: countMap.get(p.id) ?? 0,
  }));

  merged.sort((a, b) => orderMap.get(a.id)! - orderMap.get(b.id)!);
  return merged;
}
