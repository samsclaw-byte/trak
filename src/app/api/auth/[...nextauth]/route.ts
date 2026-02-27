import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

async function withLogging(
  req: Request,
  ctx: { params: Promise<{ nextauth?: string[] }> } | undefined,
  handlerFn: (req: Request, ctx?: unknown) => Promise<Response>
) {
  const url = new URL(req.url);
  if (url.pathname === "/api/auth/callback/google") {
    console.log("[TrakAuth Route]", "callback/google hit", "code:", url.searchParams.has("code"), "state:", url.searchParams.has("state"), "error:", url.searchParams.get("error") ?? "none");
  }
  return handlerFn(req, ctx);
}

const GET = (req: Request, ctx?: { params: Promise<{ nextauth?: string[] }> }) =>
  withLogging(req, ctx, (r, c) => handler(r, c as never));
const POST = (req: Request, ctx?: { params: Promise<{ nextauth?: string[] }> }) =>
  withLogging(req, ctx, (r, c) => handler(r, c as never));

export { GET, POST };
