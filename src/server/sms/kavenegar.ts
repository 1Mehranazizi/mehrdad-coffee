// Kavenegar SMS integration. Uses their "Verify Lookup" endpoint, meant
// exactly for OTP codes (https://kavenegar.com/rest.html#lookup).
// If KAVENEGAR_API_KEY is not set, the code is logged to the server
// console instead — useful for local development without SMS credit.

export async function sendOtpSms(phone: string, code: string): Promise<void> {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const template = process.env.KAVENEGAR_OTP_TEMPLATE || "mehrdadotp";

  if (!apiKey) {
    console.log(`[dev-otp] SMS to ${phone}: کد ورود شما ${code} است.`);
    return;
  }

  const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`;
  const params = new URLSearchParams({
    receptor: phone,
    token: code,
    template,
  });

  const res = await fetch(`${url}?${params.toString()}`, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Kavenegar send failed: ${res.status} ${text}`);
  }
}
