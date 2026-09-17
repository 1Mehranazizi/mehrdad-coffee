import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { listGrindOptions, createGrindOption } from "@/server/repo/products";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({error:"unauthenticated"},{status:401}); }
  return NextResponse.json({ options: listGrindOptions() });
}
export async function POST(request: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({error:"unauthenticated"},{status:401}); }
  const body=await request.json().catch(()=>null);
  const slug=String(body?.slug??"").trim(), title=String(body?.title??"").trim();
  if(!slug||!title) return NextResponse.json({error:"عنوان و اسلاگ الزامی است"},{status:400});
  try { return NextResponse.json({ option:createGrindOption({slug,title}) }); }
  catch { return NextResponse.json({error:"این اسلاگ قبلاً استفاده شده است"},{status:409}); }
}
