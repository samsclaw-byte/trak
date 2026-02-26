import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Allow sign-in; optionally restrict by email/domain here
      return !!user?.email;
    },
    async redirect({ url, baseUrl }) {
      const base = baseUrl.replace(/\/$/, "");
      const path = url.startsWith("/") ? url : new URL(url).pathname;
      // After Google sign-in, always send to profile-setup unless they had another page (e.g. /meals) as callbackUrl
      if (path === "/" || path === "" || path === "/dashboard") return `${base}/profile-setup`;
      if (url.startsWith("/")) return `${base}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/profile-setup";
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
