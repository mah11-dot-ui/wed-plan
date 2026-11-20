import { NextResponse } from "next/server";

// Auth gate — redirects unauthenticated visitors from service details to
// sign-in before any page HTML is produced. This is an optimistic check
// (cookie presence only); the page and API routes re-validate the session
// strictly on the server.
export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isProtectedServicePage =
    pathname.startsWith("/services/") && pathname.length > "/services/".length;
  const isProtectedArea = [
    "/admin",
    "/vendor",
    "/dashboard",
    "/settings",
  ].some((area) => pathname === area || pathname.startsWith(`${area}/`));

  if (!isProtectedServicePage && !isProtectedArea) {
    return NextResponse.next();
  }

  const hasSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("session_token") && cookie.value);

  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:path*", "/admin/:path*", "/vendor/:path*", "/dashboard/:path*", "/settings/:path*"],
};
