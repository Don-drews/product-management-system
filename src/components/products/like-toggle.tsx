"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LikeSignInDialog } from "@/components/auth/like-signin-dialog";

type Props = {
  productId: string;
  initialCount: number;
  initialIsLiked?: boolean; // 後で getMyLikedSet で埋める予定（今は未使用でもOK）
};

export function LikeToggle({ productId, initialCount, initialIsLiked }: Props) {
  const { status } = useSession(); // "authenticated" | "unauthenticated" | "loading"
  const [open, setOpen] = useState(false); // ダイアログ
  const [pending, setPending] = useState(false);
  const [liked, setLiked] = useState<boolean | undefined>(initialIsLiked); // 未確定はundefined
  const [count, setCount] = useState(initialCount);

  const clickUnauthed = () => {
    // いきなり遷移させず、まず促す
    setOpen(true);
  };

  const toggle = async () => {
    if (pending) return;
    setPending(true);

    // 楽観更新
    const optimisticLiked = !(liked ?? false);
    setLiked(optimisticLiked);
    setCount((c) => Math.max(0, c + (optimisticLiked ? 1 : -1)));

    try {
      const res = await fetch("/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        throw new Error("toggle failed");
      }
      const data = (await res.json()) as { isLiked: boolean };
      // サーバの最終状態で補正
      setLiked(data.isLiked);
      setCount((c) => {
        const should = data.isLiked ? (liked ?? false ? c : c) : c; // 実質そのままでOKだが将来の不整合に備えて補正ロジックを残す
        return should;
      });
    } catch {
      // ロールバック
      setLiked((prev) => !(prev ?? false));
      setCount((c) => c + (liked ?? false ? 1 : -1));
      // 任意：toastで通知してもOK
      // toast({ variant: "destructive", title: "通信に失敗しました" })
    } finally {
      setPending(false);
    }
  };

  const onClick = () => {
    if (status !== "authenticated") return clickUnauthed();
    return toggle();
  };

  const isOn = liked ?? false;

  return (
    <>
      <Button
        type="button"
        variant={isOn ? "default" : "outline"}
        size="sm"
        className="gap-1 h-8"
        onClick={onClick}
        disabled={pending || status === "loading"}
        aria-pressed={isOn}
        aria-label={isOn ? "いいねを解除" : "いいねする"}
      >
        <Heart className={`h-4 w-4 ${isOn ? "fill-current" : ""}`} />
        <span className="tabular-nums text-xs">{count}</span>
      </Button>

      {/* 未ログイン時の促し */}
      <LikeSignInDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
