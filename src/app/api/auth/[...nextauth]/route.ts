import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type RouteContext = { params: Promise<{ nextauth?: string[] }> };

async function GET(req: Request, ctx: RouteContext): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === "/api/auth/callback/google") {
    console.log("[TrakAuth Route]", "callback/google hit", "code:", url.searchParams.has("code"), "state:", url.searchParams.has("state"), "error:", url.searchParams.get("error") ?? "none");
  }
  return handler(req, ctx as never);
}

async function POST(req: Request, ctx: RouteContext): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === "/api/auth/callback/google") {
    console.log("[TrakAuth Route]", "callback/google hit", "code:", url.searchParams.has("code"), "state:", url.searchParams.has("state"), "error:", url.searchParams.get("error") ?? "none");
  }
  return handler(req, ctx as never);
}

export { GET, POST };
