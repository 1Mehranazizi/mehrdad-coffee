import { db } from "@/server/db/client";

export type Admin = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
};

type AdminRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
};

export function getAdminByEmail(email: string): Admin | undefined {
  const row = db.prepare("SELECT * FROM admins WHERE email = ?").get(email) as
    | AdminRow
    | undefined;
  if (!row) return undefined;
  return { id: row.id, email: row.email, passwordHash: row.password_hash, name: row.name };
}

export function getAdminById(id: string): Admin | undefined {
  const row = db.prepare("SELECT * FROM admins WHERE id = ?").get(id) as
    | AdminRow
    | undefined;
  if (!row) return undefined;
  return { id: row.id, email: row.email, passwordHash: row.password_hash, name: row.name };
}
