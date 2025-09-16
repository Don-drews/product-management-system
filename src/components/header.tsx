"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session, status } = useSession();

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
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user?.email}
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
