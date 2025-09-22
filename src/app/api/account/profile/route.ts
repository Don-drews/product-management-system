import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, imagePath } = body as {
    name?: string;
    imagePath?: string | null; // Supabaseの「パス」を保存する運用
  };

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(typeof name === "string" ? { name } : {}),
      ...(typeof imagePath !== "undefined" ? { image: imagePath } : {}),
    },
    select: { name: true, email: true, image: true },
  });

  return NextResponse.json(updated);
}
