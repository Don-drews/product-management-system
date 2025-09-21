import type { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" }, // ← JWT戦略

  providers: [
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 60, // リンク有効期限 1h
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request", // verifyRequest: 「確認メールを送ったよ」画面を自作したいときに指定
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as AdapterUser;
        token.id = u.id;
        token.role = (u.role ?? "USER") as "ADMIN" | "USER";
        token.picture = user.image;
      }
      if (trigger === "update") {
        if (typeof session?.name !== "undefined") {
          token.name = session.name as string | null;
        }
        if (typeof session?.image !== "undefined") {
          token.picture = session.image as string | null; // ← パスでもOK
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "ADMIN" | "USER") ?? "USER";
        session.user.name = token.name as string | null;
        session.user.image = (token.picture as string | null) ?? null;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      const admins = (process.env.AUTH_ADMIN_EMAILS ?? "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (user.email && admins.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
