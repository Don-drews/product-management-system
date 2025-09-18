"use client";

import { useEffect, useId, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LikeSignInDialog } from "@/components/auth/like-signin-dialog";

type Props = {
  productId: string;
  initialCount: number;
  initialIsLiked?: boolean;
};

const LIKE_SYNC_EVENT = "like:sync";
type LikeSyncDetail = {
  productId: string;
  isLiked: boolean;
  delta: 1 | -1;
  source: string; // 自分自身の重複反映を避けるための識別子
};

export function LikeToggle({ productId, initialCount, initialIsLiked }: Props) {
  const { status } = useSession(); // "authenticated" | "unauthenticated" | "loading"
  const [open, setOpen] = useState(false); // ダイアログ
  const [pending, setPending] = useState(false);
  const [liked, setLiked] = useState<boolean | undefined>(initialIsLiked); // 未確定はundefined
  const [count, setCount] = useState(initialCount);

  const source = useId(); // この LikeToggle インスタンスの識別子

  // 🔁 他カードからの更新を受け取って同期
  useEffect(() => {
    const handler = (e: Event) => {
      const {
        productId: pid,
        isLiked,
        delta,
        source: src,
      } = (e as CustomEvent<LikeSyncDetail>).detail ?? {};
      if (!pid || pid !== productId) return;
      if (src === source) return; // 自分が発火したイベントは無視
      setLiked(isLiked);
      setCount((c) => Math.max(0, c + delta));
    };
    window.addEventListener(LIKE_SYNC_EVENT, handler as EventListener);
    return () =>
      window.removeEventListener(LIKE_SYNC_EVENT, handler as EventListener);
  }, [productId, source]);

  const clickUnauthed = () => setOpen(true);

  const toggle = async () => {
    if (pending) return;
    setPending(true);

    try {
      const nextLiked = !(liked ?? false);
      const delta: 1 | -1 = nextLiked ? 1 : -1;
      setLiked(nextLiked);
      setCount((c) => Math.max(0, c + delta));

      const res = await fetch("/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("toggle failed");

      window.dispatchEvent(
        new CustomEvent<LikeSyncDetail>(LIKE_SYNC_EVENT, {
          detail: { productId, isLiked: nextLiked, delta, source },
        })
      );
    } catch {
      // ロールバック
      setLiked((prev) => !(prev ?? false));
      setCount((c) => Math.max(0, c + (liked ?? false ? 1 : -1)));
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
