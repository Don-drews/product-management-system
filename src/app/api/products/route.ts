import { NextResponse } from "next/server";
import { listProducts } from "@/server/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;

  const items = await listProducts(q); // ★ include 付き + DTO化済み
  return NextResponse.json({ items });
}
