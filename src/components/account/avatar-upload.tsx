"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  disabled?: boolean;
  onUploaded?: (imagePath: string) => void;
};

export default function AvatarUpload({ disabled, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { update } = useSession();
  const router = useRouter();

  const afterSaved = async (newPath: string | null) => {
    // セッションの user.image を更新（JWT の jwt コールバックで受ける）
    await update({ image: newPath ?? null });
    // サーバー側で auth() を使っている UI も即反映したい時は
    router.refresh();
  };

  const pick = () => inputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      console.log(`fileName: ${file.name},\nfileType: ${file.type},`);

      // 1) 署名付きURLを取得
      const res1 = await fetch("/api/uploads/create-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          kind: "account",
        }),
      });

      if (!res1.ok) {
        const d = await res1.json().catch(() => ({}));
        throw new Error(d?.message ?? "Failed to get signed url");
      }

      const { signedUrl, token, path } = await res1.json();

      // 2) 署名付きURLへアップロード（PUT）
      //    Supabase 公式は uploadToSignedUrl を推奨だが、fetch PUT でもOK
      const res2 = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "true",
        },
        body: file,
      });
      if (!res2.ok) throw new Error("Upload failed");

      // 3) DBの user.image を「パス」で更新
      const res3 = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: path }),
      });
      if (!res3.ok) throw new Error("Failed to save profile image");
      await afterSaved(path);

      onUploaded?.(path);
      toast.success("プロフィール画像を変更しました！");
    } catch (e: unknown) {
      console.log(`===== やっべ =====`);

      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
          ? e
          : "アップロードに失敗しました";
      alert(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <Button
        type="button"
        size="sm"
        onClick={pick}
        disabled={disabled || uploading}
      >
        {uploading ? "アップロード中..." : "画像を選択"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onUploaded?.("")} // 画像を外す（初期画像に戻す）
        disabled={disabled || uploading}
        title="アバターを外して初期画像に戻す"
      >
        画像を外す
      </Button>
    </div>
  );
}
