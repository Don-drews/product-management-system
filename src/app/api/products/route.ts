import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/server/products";
import { CreateProductSchema } from "@/schemas/product";
import { auth } from "@/auth";
import { getMyLikedSet } from "@/server/likes";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;

  const session = await auth();

  const items = await listProducts(q);
  let likedSet = new Set<string>();
  if (session?.user && items.length > 0) {
    likedSet = await getMyLikedSet(
      session.user.id,
      items.map((i) => i.id)
    );
  }

  const itemsWithIsLiked = session?.user
    ? items.map((p) => ({ ...p, isLiked: likedSet.has(p.id) }))
    : items;

  return NextResponse.json({ items: itemsWithIsLiked });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("【新規登録】\nbody:", body);
    const parsed = CreateProductSchema.parse(body); // バリデーション
    const item = await createProduct(parsed);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(`❌ createProduct failed:`, error);
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
}
