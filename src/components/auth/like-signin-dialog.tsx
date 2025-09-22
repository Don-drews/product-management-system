"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function LikeSignInDialog({ open, onOpenChange }: Props) {
  // いま見ているURLに必ず戻す
  const callbackUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? encodeURIComponent(window.location.href)
        : "%2F",
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>サインインで「いいね」を保存</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          いいねはアカウントに保存され、あとで見返せます。
        </p>

        <DialogFooter className="justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            あとで
          </Button>
          <Button asChild>
            <a href={`/auth/signin?callbackUrl=${callbackUrl}`}>サインイン</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
