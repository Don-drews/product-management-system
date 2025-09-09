import { NextResponse } from "next/server";
import { createProduct, deleteProduct, listProducts } from "@/server/products";
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
    console.log("【新規登録】\nbody:", body);
    const parsed = CreateProductSchema.parse(body); // バリデーション
    const item = await createProduct(parsed);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(`❌ createProduct failed:`, error);
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const ok = await deleteProduct(ctx.params.id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ message: "Not Found" }, { status: 404 });
}
