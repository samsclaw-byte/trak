import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type RouteContext = { params: Promise<{ nextauth?: string[] }> };

// Ensure auth responses are never cached (avoids cached 302 so callback always hits the server)
function noCache(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

async function GET(req: Request, ctx: RouteContext): Promise<Response> {
  const url = new URL(req.url);
  console.log("[TrakAuthRoute]", "GET", url.pathname, "code:", url.searchParams.has("code"), "state:", url.searchParams.has("state"));
  try {
    const res = await handler(req, ctx as never);
    return noCache(res);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[TrakAuthRoute] GET error:", msg, stack ?? "");
    throw err;
  }
}

async function POST(req: Request, ctx: RouteContext): Promise<Response> {
  const url = new URL(req.url);
  console.log("[TrakAuthRoute]", "POST", url.pathname, "code:", url.searchParams.has("code"), "state:", url.searchParams.has("state"));
  try {
    const res = await handler(req, ctx as never);
    return noCache(res);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[TrakAuthRoute] POST error:", msg, stack ?? "");
    throw err;
  }
}

export { GET, POST };
