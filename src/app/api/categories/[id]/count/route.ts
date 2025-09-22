import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = await params;

  // 指定カテゴリに紐づく商品の件数
  const count = await prisma.product.count({
    where: { categoryId: id },
  });

  return NextResponse.json({ count }, { status: 200 });
}
