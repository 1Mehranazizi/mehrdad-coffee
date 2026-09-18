import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminByEmail } from "@/server/repo/admins";
import { createAdminSessionToken, ADMIN_COOKIE } from "@/server/auth/admin";
import { useSecureCookies } from "@/server/auth/cookie-names";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const admin = getAdminByEmail(email);
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
  }

  const token = await createAdminSessionToken(admin.id, admin.email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
