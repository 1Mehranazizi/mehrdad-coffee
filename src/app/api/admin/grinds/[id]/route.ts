import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { updateGrindOption, deleteGrindOption } from "@/server/repo/products";

export async function PATCH(request: Request,{params}:{params:Promise<{id:string}>}) {
  try { await requireAdmin(); } catch { return NextResponse.json({error:"unauthenticated"},{status:401}); }
  const {id}=await params; const body=await request.json().catch(()=>null);
  const slug=String(body?.slug??"").trim(), title=String(body?.title??"").trim();
  if(!slug||!title) return NextResponse.json({error:"عنوان و اسلاگ الزامی است"},{status:400});
  try { updateGrindOption(id,{slug,title}); return NextResponse.json({ok:true}); }
  catch { return NextResponse.json({error:"ویرایش انجام نشد"},{status:400}); }
}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}) {
  try { await requireAdmin(); } catch { return NextResponse.json({error:"unauthenticated"},{status:401}); }
  deleteGrindOption((await params).id); return NextResponse.json({ok:true});
}
