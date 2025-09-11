import { createCategory } from "@/server/categories";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const item = await createCategory(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // 一意制約エラー
        return NextResponse.json(
          { message: "Slug is already used" },
          { status: 409 }
        );
      }
    }

    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
