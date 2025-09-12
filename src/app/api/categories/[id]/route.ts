// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { UpdateCategorySchema } from "@/schemas/category";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/server/categories";

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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json(); // ← 一度だけ読む
    const input = UpdateCategorySchema.parse(body);
    const item = await updateCategory(params.id, input);
    return NextResponse.json({ item }, { status: 200 });
  } catch (e: unknown) {
    const { status, message } = handleApiError(e);
    return NextResponse.json({ message }, { status });
  }
}

type Params = Promise<{ id: string }>;

export async function DELETE(_req: Request, ctx: { params: Params }) {
  try {
    console.log(`=== next, cat ===`);
    const cat = await getCategoryById((await ctx.params).id);
    console.log(`=== cat ===\n${cat}`);

    if (!cat)
      return NextResponse.json({ message: "Not Found." }, { status: 404 });
    await deleteCategory((await ctx.params).id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: unknown) {
    console.log(`-!- errorCatch -!-`);
    console.error("❌ deleteCategory failed\n", e);
    const { status, message } = handleApiError(e);
    console.log(`status: ${status}\nerror message: ${message}`);

    return NextResponse.json({ message }, { status });
  }
}
