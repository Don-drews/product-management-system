import { handleApiError } from "@/lib/errors/api-error";
import { createCategory, listCategories } from "@/server/categories";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await listCategories();
    return NextResponse.json({ items });
  } catch (e: unknown) {
    const { status, message } = handleApiError(e);
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await createCategory(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (e: unknown) {
    const { status, message } = handleApiError(e);
    return NextResponse.json({ message }, { status });
  }
}
