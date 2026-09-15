// Kept in their own file (no DB imports) so middleware — which runs on
// the Edge runtime and can't load the native SQLite binding — can read
// these constants without pulling in server/repo code.
export const CUSTOMER_COOKIE = "customer_session";
export const ADMIN_COOKIE = "admin_session";
