// ZarinPal payment gateway (https://docs.zarinpal.com).
// When ZARINPAL_MERCHANT_ID is not set, falls back to a local "mock"
// payment page so the full checkout flow can be tested without real
// merchant credentials. Once a real merchant ID is added to .env,
// this automatically switches to the real gateway.

const isSandbox = process.env.ZARINPAL_SANDBOX !== "false";

function apiBase() {
  return isSandbox
    ? "https://sandbox.zarinpal.com/pg/v4/payment"
    : "https://api.zarinpal.com/pg/v4/payment";
}

function startPayBase() {
  return isSandbox
    ? "https://sandbox.zarinpal.com/pg/StartPay"
    : "https://www.zarinpal.com/pg/StartPay";
}

function isMockMode(): boolean {
  return !process.env.ZARINPAL_MERCHANT_ID;
}

export type PaymentRequestResult = {
  ok: boolean;
  authority?: string;
  paymentUrl?: string;
  error?: string;
};

export async function requestPayment(input: {
  amountToman: number;
  description: string;
  callbackUrl: string;
  mobile?: string;
}): Promise<PaymentRequestResult> {
  if (isMockMode()) {
    const authority = `MOCK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    return {
      ok: true,
      authority,
      paymentUrl: `/checkout/mock-pay?authority=${authority}&callback=${encodeURIComponent(
        input.callbackUrl
      )}`,
    };
  }

  const res = await fetch(`${apiBase()}/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: input.amountToman,
      currency: "IRT",
      description: input.description,
      callback_url: input.callbackUrl,
      metadata: input.mobile ? { mobile: input.mobile } : undefined,
    }),
  });

  const data = await res.json();
  if (data?.data?.code === 100) {
    const authority = data.data.authority as string;
    return {
      ok: true,
      authority,
      paymentUrl: `${startPayBase()}/${authority}`,
    };
  }
  return {
    ok: false,
    error: data?.errors?.message || "خطا در اتصال به درگاه پرداخت زرین‌پال",
  };
}

export type PaymentVerifyResult = {
  ok: boolean;
  refId?: string;
  error?: string;
};

export async function verifyPayment(input: {
  authority: string;
  amountToman: number;
}): Promise<PaymentVerifyResult> {
  if (isMockMode() || input.authority.startsWith("MOCK")) {
    return { ok: true, refId: `MOCKREF${Date.now()}` };
  }

  const res = await fetch(`${apiBase()}/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: input.amountToman,
      currency: "IRT",
      authority: input.authority,
    }),
  });

  const data = await res.json();
  if (data?.data?.code === 100 || data?.data?.code === 101) {
    return { ok: true, refId: String(data.data.ref_id) };
  }
  return {
    ok: false,
    error: data?.errors?.message || "پرداخت تایید نشد",
  };
}
