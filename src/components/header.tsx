"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getAccountImageSrcUrl } from "@/lib/storage/src";

export function Header() {
  const { data: session, status } = useSession();

  const accountImage = session?.user.image ? session.user.image : null;
  const avatarSrc = getAccountImageSrcUrl(accountImage);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          MyApp
        </Link>

        {status === "loading" ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        ) : session ? (
          <DropdownMenu>
            {/* トリガー：アバター＋（PC時のみ）メールを並べる */}
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-2"
                aria-label="アカウントメニューを開く"
              >
                <span className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={avatarSrc}
                    alt="avatar"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {session.user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>

            {/* メニュー本体 */}
            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/account">プロフィール編集</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/favorites">お気に入り一覧</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault(); // Linkの既定動作抑止
                  signOut({ callbackUrl: "/" });
                }}
              >
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" asChild>
            <Link href="/auth/signin?callbackUrl=/admin">サインイン</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
