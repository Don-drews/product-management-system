import { NextResponse } from "next/server";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/server/products";
import { UpdateProductSchema } from "@/schemas/product";

// 変数に"_"がつく意味 → 呼ばれているが、使用されていない変数は"_"をつける。
// "_req"とすることでLinterの「未使用変数の警告」が出なくなる。
export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const p = await getProductById(ctx.params.id);
  if (!p) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  return NextResponse.json({ item: p });
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    const body = await req.json();
    console.log("【更新】\nbody:", body);
    const input = UpdateProductSchema.parse(body);
    const updated = await updateProduct(ctx.params.id, input);
    if (!updated)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("❌ update failed:", error);
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: Promise<{ params: { id: string } }>
) {
  const ok = await deleteProduct((await ctx).params.id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ message: "Not Found" }, { status: 404 });
}
