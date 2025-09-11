// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/api-error";
import { UpdateCategorySchema } from "@/schemas/category";
import { updateCategory } from "@/server/categories";

// export async function GET(
//   _req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const item = await getCategory(params.id);
//     return NextResponse.json({ item }, { status: 200 });
//   } catch (e: unknown) {
//     const { status, message } = handleApiError(e);
//     return NextResponse.json({ message }, { status });
//   }
// }

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

// export async function DELETE(
//   _req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await deleteCategory(params.id);
//     return NextResponse.json({ ok: true }, { status: 200 });
//   } catch (e: unknown) {
//     const { status, message } = handleApiError(e);
//     return NextResponse.json({ message }, { status });
//   }
// }
