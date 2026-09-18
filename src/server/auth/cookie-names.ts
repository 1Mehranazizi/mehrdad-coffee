// Kept in their own file (no DB imports) so middleware — which runs on
// the Edge runtime and can't load the native SQLite binding — can read
// these constants without pulling in server/repo code.
export const CUSTOMER_COOKIE = "customer_session";
export const ADMIN_COOKIE = "admin_session";

// A "secure" cookie is silently dropped by the browser on a plain HTTP
// connection — so basing it on NODE_ENV alone breaks login on any
// production deployment that hasn't had SSL set up yet. Base it on
// whether a real https:// base URL has been configured instead.
export function useSecureCookies(): boolean {
  return (process.env.NEXT_PUBLIC_BASE_URL || "").startsWith("https://");
}
