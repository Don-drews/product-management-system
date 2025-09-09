import { NextResponse } from "next/server";
import { getProductById } from "@/server/products";

// 変数に"_"がつく意味 → 呼ばれているが、使用されていない変数は"_"をつける。
// "_req"とすることでLinterの「未使用変数の警告」が出なくなる。
export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const p = await getProductById(ctx.params.id);
  if (!p) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  return NextResponse.json({ item: p });
}
