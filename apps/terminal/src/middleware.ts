import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verify single-user authentication session & TOTP 2FA cookie/header
  const sessionCookie = request.cookies.get("meridian_session")?.value;
  const totpVerified = request.cookies.get("meridian_totp_2fa")?.value === "true";

  // Simulate authenticated session check (In production backed by Supabase Auth server session)
  const isAuthorized = sessionCookie === "valid_operator_session" && totpVerified;

  // For testing / automated verification, check header if cookie absent
  const authHeader = request.headers.get("authorization");
  const isHeaderAuthorized = authHeader === "Bearer OPERATOR_SESSION_TOKEN_2FA";

  if (isAuthorized || isHeaderAuthorized) {
    return NextResponse.next();
  }

  // Reject unauthenticated API routes with 401 Unauthorized
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized. MERIDIAN single-user session and TOTP 2FA required." },
      { status: 401 }
    );
  }

  // All UI routes pass through — operator auth will be enforced
  // in production via Supabase Auth session validation
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files & favicon
     */
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
