import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login" || pathname.startsWith("/admin/reset");
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isAdmin && !isLogin && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin/login" && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  if (process.env.NODE_ENV === "production" && request.headers.get("x-forwarded-proto") === "http") {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
