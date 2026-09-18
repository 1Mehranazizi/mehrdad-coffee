import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/auth/customer";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ loggedIn: false });
  return NextResponse.json({
    loggedIn: true,
    phone: customer.phone,
    name: customer.name,
  });
}
