import { NextResponse } from "next/server";
import { CreateProduct, listProducts } from "@/server/products";
import { CreateProductSchema } from "@/schemas/product";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;

  const items = await listProducts(q);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateProductSchema.parse(body); // バリデーション
    const item = await CreateProduct(parsed);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(`❌ createProduct failed:`, error);
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
}
