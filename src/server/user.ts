"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EditProfileSchema } from "@/schemas/user";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const raw = { name: formData.get("name") };
  const parsed = EditProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/account");
  return { ok: true };
}
