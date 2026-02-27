import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Log every /api/auth request so we can see callback hits in Vercel logs
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const pathname = request.nextUrl.pathname;
    const hasCode = request.nextUrl.searchParams.has("code");
    const hasState = request.nextUrl.searchParams.has("state");
    const hasError = request.nextUrl.searchParams.has("error");
    // Use a unique prefix so you can search Vercel logs for "TrakAuth"
    console.log(
      "[TrakAuth]",
      request.method,
      pathname,
      "code:",
      hasCode,
      "state:",
      hasState,
      "error:",
      hasError
    );
  }
  return NextResponse.next();
}
