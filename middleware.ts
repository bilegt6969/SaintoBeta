import { STUDIO_ACCESS_COOKIE } from "lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/studio")) {
    const studioSecret = process.env.STUDIO_ACCESS_SECRET;
    if (!studioSecret) {
      return NextResponse.next();
    }

    const keyFromQuery = request.nextUrl.searchParams.get("key");
    const keyFromCookie = request.cookies.get(STUDIO_ACCESS_COOKIE)?.value;

    if (keyFromQuery === studioSecret) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("key");
      const response = NextResponse.redirect(url);
      response.cookies.set(STUDIO_ACCESS_COOKIE, studioSecret, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/studio",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    if (keyFromCookie === studioSecret) {
      return NextResponse.next();
    }

    return new NextResponse("Studio access denied.", { status: 401 });
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("__session")?.value;
    if (!session) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = "/sign-in";
      signInUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/admin/:path*"],
};
