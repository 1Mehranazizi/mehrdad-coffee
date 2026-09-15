import { cookies } from "next/headers";
import { signToken, verifyToken } from "@/server/auth/jwt";
import { getAdminById } from "@/server/repo/admins";
import { ADMIN_COOKIE } from "@/server/auth/cookie-names";

export { ADMIN_COOKIE };

type AdminTokenPayload = {
  sub: string;
  email: string;
};

export async function createAdminSessionToken(
  adminId: string,
  email: string
): Promise<string> {
  return signToken({ sub: adminId, email }, "7d");
}

export async function getCurrentAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken<AdminTokenPayload>(token);
  if (!payload?.sub) return null;
  const admin = getAdminById(payload.sub);
  return admin ?? null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHENTICATED");
  }
  return admin;
}
