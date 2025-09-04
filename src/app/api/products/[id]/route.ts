import { NextResponse } from "next/server";
import { getProductById } from "@/server/products";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const p = await getProductById(ctx.params.id);
  if (!p) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  return NextResponse.json({ item: p });
}
