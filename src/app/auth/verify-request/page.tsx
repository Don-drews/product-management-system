"use client";

import Link from "next/link";
import { MailCheck, RefreshCcw, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { signIn } from "next-auth/react";

const COOLDOWN_MS = 30_000; // 30秒

export default function VerifyRequestPage() {
  const sp = useSearchParams();
  const qsEmail = sp.get("email") ?? "";
  const callbackUrl = sp.get("callbackUrl") ?? "/";

  // ① クエリ優先、なければ localStorage から復元
  const [email, setEmail] = useState(qsEmail);
  useEffect(() => {
    if (!qsEmail) {
      try {
        const saved = localStorage.getItem("lastSignInEmail") ?? "";
        if (saved) setEmail(saved);
      } catch {}
    }
  }, [qsEmail]);

  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  // ② クールダウン残り時間（ms）
  const [remainingMs, setRemainingMs] = useState(0);
  const timerRef = useRef<number | null>(null);
  const keyFor = (addr: string) => `resendCooldown:${addr}`;

  // 残り時間の更新を開始/停止
  const startCooldownTimer = (lastSentAt: number) => {
    // 直ちに残りを反映
    const update = () => {
      const remain = Math.max(0, COOLDOWN_MS - (Date.now() - lastSentAt));
      setRemainingMs(remain);
      if (remain <= 0 && timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    update();
    if (!timerRef.current) {
      timerRef.current = window.setInterval(update, 250) as unknown as number; // 0.25秒刻み
    }
  };

  // ③ 初期ロード：保存された最終送信時刻があればカウントダウン開始
  useEffect(() => {
    if (!email) return;
    try {
      const raw = localStorage.getItem(keyFor(email));
      const last = raw ? Number(raw) : 0;
      if (last && Date.now() - last < COOLDOWN_MS) {
        startCooldownTimer(last);
      } else {
        setRemainingMs(0);
      }
    } catch {
      setRemainingMs(0);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [email]);

  const canResend = useMemo(() => !!email, [email]);
  const remainingSec = Math.ceil(remainingMs / 1000);

  const handleResend = () => {
    if (!email) return;
    if (remainingMs > 0) return; // クールダウン中は弾く
    setMsg(null);

    startTransition(async () => {
      await signIn("email", { email, callbackUrl, redirect: false });
      setMsg("確認メールを再送しました。受信トレイをご確認ください。");
      // 送信時刻を保存し、カウントダウン開始
      try {
        const now = Date.now();
        localStorage.setItem(keyFor(email), String(now));
        startCooldownTimer(now);
      } catch {}
    });
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950"
    >
      <Card
        className="w-full max-w-md backdrop-blur supports-[backdrop-filter]:bg-white/70
        dark:supports-[backdrop-filter]:bg-slate-900/60 border border-white/40 dark:border-white/10"
      >
        <CardHeader className="text-center space-y-3">
          <div
            className="mx-auto h-12 w-12 rounded-full flex items-center justify-center
            bg-black/5 dark:bg-white/10"
          >
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">メールを送信しました</CardTitle>
          <CardDescription>
            受信トレイの<strong>マジックリンク</strong>
            をクリックしてサインインを完了してください。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>メールが見当たらない場合は、以下をお試しください：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>迷惑メールフォルダを確認する</li>
            <li>数十秒待ってから更新する</li>
            <li>別のメールアドレスでやり直す</li>
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 items-stretch">
          {msg && <p className="mb-3 text-sm text-emerald-600">{msg}</p>}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button asChild variant="outline" className="w-full sm:flex-1">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る（別のメールで送る）
              </Link>
            </Button>
            <Button
              type="button"
              className="w-full sm:flex-1"
              disabled={!canResend || isPending}
              onClick={handleResend}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  再送中…
                </>
              ) : remainingMs > 0 ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 opacity-60" />
                  {remainingSec} 秒後に再送可能
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  確認メールを再送
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">
            {email
              ? `送信先: ${email}`
              : "送信先のメールが取得できません。戻って入力し直してください。"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
