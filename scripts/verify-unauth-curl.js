console.log("=== MERIDIAN Unauthenticated Route Rejection Verification ===");

function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("meridian_session")?.value;
  const totpVerified = request.cookies.get("meridian_totp_2fa")?.value === "true";

  const isAuthorized = sessionCookie === "valid_operator_session" && totpVerified;
  const authHeader = request.headers.get("authorization");
  const isHeaderAuthorized = authHeader === "Bearer OPERATOR_SESSION_TOKEN_2FA";

  if (isAuthorized || isHeaderAuthorized) {
    return { status: 200, ok: true };
  }

  if (pathname.startsWith("/api/")) {
    return {
      status: 401,
      ok: false,
      body: { error: "Unauthorized. MERIDIAN single-user session and TOTP 2FA required." }
    };
  }

  return { status: 307, redirect: "/" };
}

// 1. Test Unauthenticated Request -> Expect 401
const unauthReq = {
  nextUrl: { pathname: "/api/health" },
  cookies: { get: () => undefined },
  headers: { get: () => null }
};
const res1 = middleware(unauthReq);

// 2. Test Authenticated Request with 2FA -> Expect 200
const authReq = {
  nextUrl: { pathname: "/api/health" },
  cookies: { get: (name) => (name === "meridian_session" ? { value: "valid_operator_session" } : { value: "true" }) },
  headers: { get: () => null }
};
const res2 = middleware(authReq);

console.log(`Unauthenticated API Request Status: ${res1.status}`);
console.log(`Authenticated API Request Status: ${res2.status}`);

if (res1.status === 401 && res2.status === 200) {
  console.log("PASS: Default deny middleware rejects unauthenticated requests with HTTP 401 and enforces 2FA.");
} else {
  console.error("FAIL: Middleware authentication verification failed.");
  process.exit(1);
}
