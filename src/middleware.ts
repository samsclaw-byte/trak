import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api/auth")) {
    const hasCode = request.nextUrl.searchParams.has("code");
    const hasState = request.nextUrl.searchParams.has("state");
    const hasError = request.nextUrl.searchParams.has("error");
    console.log("[TrakAuth]", request.method, pathname, "code:", hasCode, "state:", hasState, "error:", hasError);

    // Force no-cache for auth (especially callback) so CDN never caches the redirect
    if (pathname.includes("callback")) {
      return NextResponse.next({
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      });
    }
  }
  return NextResponse.next();
}
