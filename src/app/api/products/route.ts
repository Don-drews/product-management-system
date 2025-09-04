import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types/product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined; // ついでに簡易検索も対応（任意）

  // mode: "insensitive" → 大文字小文字を区別しない、"default" → 大文字小文字を区別する。
  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Date -> ISO 文字列に整形（DTO化）
  const data: Product[] = items.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return NextResponse.json({ items: data });
}
