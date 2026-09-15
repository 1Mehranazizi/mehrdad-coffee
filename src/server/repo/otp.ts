import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

type OtpRow = {
  id: string;
  phone: string;
  code_hash: string;
  expires_at: string;
  consumed: number;
  created_at: string;
};

export function createOtpCode(input: {
  phone: string;
  codeHash: string;
  expiresAt: Date;
}): void {
  const id = newId("otp");
  db.prepare(
    "INSERT INTO otp_codes (id, phone, code_hash, expires_at) VALUES (?, ?, ?, ?)"
  ).run(id, input.phone, input.codeHash, input.expiresAt.toISOString());
}

export function getLastOtpForPhone(phone: string): OtpRow | undefined {
  return db
    .prepare(
      "SELECT * FROM otp_codes WHERE phone = ? ORDER BY created_at DESC LIMIT 1"
    )
    .get(phone) as OtpRow | undefined;
}

export function getLatestUnconsumedOtp(phone: string): OtpRow | undefined {
  return db
    .prepare(
      "SELECT * FROM otp_codes WHERE phone = ? AND consumed = 0 ORDER BY created_at DESC LIMIT 1"
    )
    .get(phone) as OtpRow | undefined;
}

export function markOtpConsumed(id: string): void {
  db.prepare("UPDATE otp_codes SET consumed = 1 WHERE id = ?").run(id);
}
