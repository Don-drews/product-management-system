"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import AvatarUpload from "./avatar-upload";
import { getAccountImageSrcUrl } from "@/lib/storage/src";

type Props = {
  defaultValues: {
    name: string;
    // 追加: imagePath は DB に保存されている「パス」想定（null/空なら未設定）
    imagePath?: string | null;
  };
};

export default function ProfileForm({ defaultValues }: Props) {
  const [name, setName] = useState(defaultValues.name ?? "");
  const [imagePath, setImagePath] = useState<string | null>(
    defaultValues.imagePath ?? null
  );
  const [saving, setSaving] = useState(false);

  const { update } = useSession();
  const router = useRouter();

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imagePath }),
      });
      if (!res.ok) throw new Error("保存に失敗しました");

      // セッションへ即反映
      await update({ name, image: imagePath ?? null });
      router.refresh();
      toast.success("名前を変更しました！");
    } catch (err) {
      console.log((err as Error).message);
      toast.error("エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = getAccountImageSrcUrl(imagePath);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      {/* アバター */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          <Image
            src={avatarUrl}
            alt="avatar"
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <AvatarUpload
          onUploaded={(path) => setImagePath(path || null)}
          disabled={saving}
        />
      </div>

      {/* 表示名 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">表示名</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="表示名を入力"
        />
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
