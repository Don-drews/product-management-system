import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { UpdateCategorySchema } from "@/schemas/category";
import {
  deleteCategoryReassigningProducts,
  getCategoryById,
  updateCategory,
} from "@/server/categories";

type Params = Promise<{ id: string }>;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getCategoryById(params.id);
    return NextResponse.json({ item }, { status: 200 });
  } catch (e: unknown) {
    const { status, message } = handleApiError(e);
    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const body = await req.json();
    const input = UpdateCategorySchema.parse(body);
    const item = await updateCategory((await params).id, input);
    return NextResponse.json({ item }, { status: 200 });
  } catch (e: unknown) {
    const { status, message } = handleApiError(e);
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(_req: Request, ctx: { params: Params }) {
  try {
    const { id } = await ctx.params;
    const result = await deleteCategoryReassigningProducts(id);
    return NextResponse.json(
      {
        message: "カテゴリを削除しました。関連商品は未分類へ移動しました。",
        movedProducts: result.movedProductsCount,
        deletedCategory: result.deletedCategory,
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    console.error("❌ deleteCategory failed.\n", e);
    const { status, message } = handleApiError(e);
    console.log(`status: ${status}\nerror message: ${message}`);

    return NextResponse.json({ message }, { status });
  }
}
