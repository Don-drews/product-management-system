"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getAccountImageSrcUrl } from "@/lib/storage/src";

export function Header() {
  const { data: session, status } = useSession();

  const accountImage = session?.user.image ? session.user.image : null;
  console.log(`accountImage:${accountImage}`);

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
          <div className="flex items-center gap-3">
            {/* アバター画像 */}
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Link href={`/account`}>
                <Image
                  src={avatarSrc}
                  alt="avatar"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </Link>
            </div>

            {/* メール（PC表示のみ） */}
            <span className="hidden text-sm text-muted-foreground sm:inline">
              <Link href={`/account`}>{session.user?.email}</Link>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              ログアウト
            </Button>
          </div>
        ) : (
          <Button size="sm" asChild>
            <Link href="/auth/signin?callbackUrl=/admin">サインイン</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
