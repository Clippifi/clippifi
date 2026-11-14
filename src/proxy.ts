import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Quick redirect for signed-out visitors to the app. This only checks that a session
// cookie exists; every page still verifies the session on the server (requireSession).
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/c/:path*", "/c"],
};
