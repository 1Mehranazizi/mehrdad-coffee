import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/auth/customer";
import { getApplicationByCustomer, submitApplication } from "@/server/repo/partners";
import { isValidLocation } from "@/lib/iran-locations";
import { isValidNationalCode } from "@/lib/partner";
import { normalizeDigits } from "@/lib/pagination";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });
  return NextResponse.json({
    type: customer.type,
    application: getApplicationByCustomer(customer.id) ?? null,
  });
}

const str = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "اطلاعات نامعتبر است" }, { status: 400 });

  const ownerName = str(body.ownerName);
  const nationalCode = normalizeDigits(str(body.nationalCode, 20));
  const cafeName = str(body.cafeName);
  const cafePhone = normalizeDigits(str(body.cafePhone, 20)).replace(/[\s-]/g, "");
  const province = str(body.province);
  const city = str(body.city);
  const addressLine = str(body.addressLine, 500);
  const licenseNumber = normalizeDigits(str(body.licenseNumber, 50)) || null;
  const instagram = str(body.instagram, 100).replace(/^@/, "") || null;

  if (!ownerName || !cafeName || !addressLine) {
    return NextResponse.json({ error: "لطفاً همه‌ی فیلدهای ضروری را پر کنید" }, { status: 400 });
  }
  if (!isValidNationalCode(nationalCode)) {
    return NextResponse.json({ error: "کد ملی وارد‌شده معتبر نیست" }, { status: 400 });
  }
  if (!/^0\d{9,10}$/.test(cafePhone)) {
    return NextResponse.json({ error: "شماره تماس کافه معتبر نیست" }, { status: 400 });
  }
  if (!isValidLocation(province, city)) {
    return NextResponse.json({ error: "استان یا شهر انتخاب‌شده معتبر نیست" }, { status: 400 });
  }

  try {
    const application = submitApplication(customer.id, {
      ownerName,
      nationalCode,
      cafeName,
      cafePhone,
      province,
      city,
      addressLine,
      licenseNumber,
      instagram,
    });
    return NextResponse.json({ application });
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "ALREADY_PENDING")
      return NextResponse.json({ error: "درخواست قبلی شما در حال بررسی است" }, { status: 409 });
    if (code === "ALREADY_APPROVED")
      return NextResponse.json({ error: "حساب شما قبلاً به‌عنوان همکار تأیید شده است" }, { status: 409 });
    console.error(err);
    return NextResponse.json({ error: "ثبت درخواست ناموفق بود" }, { status: 500 });
  }
}
