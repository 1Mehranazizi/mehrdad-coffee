import { cookies } from "next/headers";
import { signToken, verifyToken } from "@/server/auth/jwt";
import { getCustomerById } from "@/server/repo/customers";
import { CUSTOMER_COOKIE } from "@/server/auth/cookie-names";

export { CUSTOMER_COOKIE };

type CustomerTokenPayload = {
  sub: string;
  phone: string;
};

export async function createCustomerSessionToken(
  customerId: string,
  phone: string
): Promise<string> {
  return signToken({ sub: customerId, phone }, "30d");
}

export async function getCurrentCustomer() {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken<CustomerTokenPayload>(token);
  if (!payload?.sub) return null;
  const customer = getCustomerById(payload.sub);
  return customer ?? null;
}

export async function requireCustomer() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    throw new Error("UNAUTHENTICATED");
  }
  return customer;
}
