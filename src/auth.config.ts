import NextAuth, { type NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  providers: [
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 60, // リンク有効期限(秒) 1時間
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthOptions;

export default NextAuth(authOptions);
