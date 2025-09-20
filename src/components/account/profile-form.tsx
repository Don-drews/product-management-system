"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/server/user";
import { EditProfileInput, EditProfileSchema } from "@/schemas/user";
import { toast } from "sonner";

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: EditProfileInput;
}) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [pending, startTransition] = useTransition();

  const form = useForm<EditProfileInput>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues,
  });

  const onSubmit = (values: EditProfileInput) => {
    const fd = new FormData();
    fd.set("name", values.name);

    startTransition(async () => {
      const res = await updateProfile(fd);
      if (!res.ok) {
        toast.error("エラーが発生しました");
        return;
      }
      toast.success("名前を変更しました！");
      await updateSession({ name: values.name }); // ヘッダーの表示名も即更新
      router.refresh();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">名前</Label>
        <Input id="name" {...form.register("name")} disabled={pending} />
        <p className="text-xs text-red-500">
          {form.formState.errors.name?.message}
        </p>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "更新中…" : "保存"}
      </Button>
    </form>
  );
}
