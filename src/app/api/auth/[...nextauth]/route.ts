import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

type RouteContext = { params: Promise<{ nextauth?: string[] }> };

async function GET(req: Request, ctx: RouteContext): Promise<Response> {
  const url = new URL(req.url);
  // Log every auth request in the route (Runtime/Function logs) so callback is visible
  console.log("[TrakAuthRoute]", "GET", url.pathname, "code:", url.searchParams.has("code"), "state:", url.searchParams.has("state"));
  try {
    return await handler(req, ctx as never);
  } catch (err) {
    console.error("[TrakAuthRoute] GET error:", err);
    throw err;
  }
}

async function POST(req: Request, ctx: RouteContext): Promise<Response> {
  const url = new URL(req.url);
  console.log("[TrakAuthRoute]", "POST", url.pathname, "code:", url.searchParams.has("code"), "state:", url.searchParams.has("state"));
  try {
    return await handler(req, ctx as never);
  } catch (err) {
    console.error("[TrakAuthRoute] POST error:", err);
    throw err;
  }
}

export { GET, POST };
