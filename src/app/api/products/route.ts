import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mapper/product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;

  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: items.map(toProductDTO) });
}
