import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE } from "@/server/auth/cookie-names";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CUSTOMER_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
