import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getLatestUnconsumedOtp, markOtpConsumed } from "@/server/repo/otp";
import { getOrCreateCustomerByPhone } from "@/server/repo/customers";
import { createCustomerSessionToken, CUSTOMER_COOKIE } from "@/server/auth/customer";
import { useSecureCookies } from "@/server/auth/cookie-names";

const PHONE_REGEX = /^09\d{9}$/;

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = String(body?.phone ?? "").trim();
  const code = String(body?.code ?? "").trim();

  if (!PHONE_REGEX.test(phone) || !/^\d{5}$/.test(code)) {
    return NextResponse.json({ error: "اطلاعات ورودی نامعتبر است" }, { status: 400 });
  }

  const otp = getLatestUnconsumedOtp(phone);
  if (!otp) {
    return NextResponse.json(
      { error: "کدی برای این شماره ارسال نشده یا قبلاً استفاده شده است" },
      { status: 400 }
    );
  }
  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "کد منقضی شده است، دوباره درخواست دهید" }, { status: 400 });
  }
  if (otp.code_hash !== hashCode(code)) {
    return NextResponse.json({ error: "کد وارد شده اشتباه است" }, { status: 400 });
  }

  markOtpConsumed(otp.id);
  const customer = getOrCreateCustomerByPhone(phone);
  const token = await createCustomerSessionToken(customer.id, customer.phone);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
