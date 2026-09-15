import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/server/auth/jwt";
import { ADMIN_COOKIE, CUSTOMER_COOKIE } from "@/server/auth/cookie-names";

const ADMIN_PUBLIC_PATHS = ["/admin/login"];
// Only the actual checkout form needs a session — the mock gateway and
// the post-payment result page must stay reachable even if the
// customer's session cookie happens to have expired in between.
const CUSTOMER_PROTECTED_EXACT = ["/checkout"];
const CUSTOMER_PROTECTED_PREFIXES = ["/account"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !ADMIN_PUBLIC_PATHS.includes(pathname)) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const needsCustomerAuth =
    CUSTOMER_PROTECTED_EXACT.includes(pathname) ||
    CUSTOMER_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (needsCustomerAuth) {
    const token = request.cookies.get(CUSTOMER_COOKIE)?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout"],
};
