import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Set to false to test: if signin then redirects to Google, the failure is the DB adapter.
const useDatabaseSession = false; // !!process.env.DATABASE_URL;

export const authOptions: NextAuthOptions = {
  ...(useDatabaseSession ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user?.email;
    },
    async redirect({ url, baseUrl }) {
      const base = baseUrl.replace(/\/$/, "");
      const path = url.startsWith("/") ? url : new URL(url).pathname;
      if (path === "/" || path === "" || path === "/dashboard") return `${base}/profile-setup`;
      if (url.startsWith("/")) return `${base}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/profile-setup";
    },
    async session(args) {
      const { session } = args;
      if (session.user) {
        if (useDatabaseSession && "user" in args) {
          session.user.id = args.user.id;
        } else if ("token" in args) {
          session.user.id = args.token.sub ?? "";
        }
      }
      return session;
    },
    ...(useDatabaseSession ? {} : { async jwt({ token }) { return token; } }),
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: useDatabaseSession ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60,
    ...(useDatabaseSession && { updateAge: 24 * 60 * 60 }),
  },
  secret: process.env.NEXTAUTH_SECRET?.trim(), // trim in case env has trailing newline/space from Vercel
  cookies: {
    // Ensure state/callback cookies work when Google redirects back (sameSite: lax)
    callbackUrl: {
      name: "__Secure-next-auth.callback-url",
      options: { sameSite: "lax" as const, secure: true },
    },
    csrfToken: {
      name: "__Host-next-auth.csrf-token",
      options: { sameSite: "lax" as const, secure: true },
    },
  },
};
