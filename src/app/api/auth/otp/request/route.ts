import { NextResponse } from "next/server";
import { randomInt, createHash } from "node:crypto";
import { createOtpCode, getLastOtpForPhone } from "@/server/repo/otp";
import { sendOtpSms } from "@/server/sms/kavenegar";

const PHONE_REGEX = /^09\d{9}$/;
const RESEND_COOLDOWN_MS = 60_000;
const OTP_TTL_MS = 2 * 60_000;

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = String(body?.phone ?? "").trim();

  if (!PHONE_REGEX.test(phone)) {
    return NextResponse.json(
      { error: "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)" },
      { status: 400 }
    );
  }

  const last = getLastOtpForPhone(phone);
  if (last) {
    const elapsed = Date.now() - new Date(last.created_at.replace(" ", "T") + "Z").getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
      return NextResponse.json(
        { error: `لطفاً ${wait} ثانیه دیگر دوباره تلاش کنید` },
        { status: 429 }
      );
    }
  }

  const code = randomInt(10000, 99999).toString();
  createOtpCode({
    phone,
    codeHash: hashCode(code),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  try {
    // await sendOtpSms(phone, code);
    console.log(`otp : ${code}`);
    
  } catch {
    return NextResponse.json(
      { error: "ارسال پیامک با خطا مواجه شد. کمی بعد دوباره تلاش کنید" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
