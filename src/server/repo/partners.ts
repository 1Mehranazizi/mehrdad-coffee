import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";
import { buildPaged, likePattern, type Paged } from "@/lib/pagination";
import type { PartnerStatus } from "@/lib/partner";

export type PartnerApplication = {
  id: string;
  customerId: string;
  ownerName: string;
  nationalCode: string;
  cafeName: string;
  cafePhone: string;
  province: string;
  city: string;
  addressLine: string;
  licenseNumber: string | null;
  instagram: string | null;
  status: PartnerStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
};

type Row = {
  id: string;
  customer_id: string;
  owner_name: string;
  national_code: string;
  cafe_name: string;
  cafe_phone: string;
  province: string;
  city: string;
  address_line: string;
  license_number: string | null;
  instagram: string | null;
  status: PartnerStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
};

function mapRow(r: Row): PartnerApplication {
  return {
    id: r.id,
    customerId: r.customer_id,
    ownerName: r.owner_name,
    nationalCode: r.national_code,
    cafeName: r.cafe_name,
    cafePhone: r.cafe_phone,
    province: r.province,
    city: r.city,
    addressLine: r.address_line,
    licenseNumber: r.license_number,
    instagram: r.instagram,
    status: r.status,
    adminNote: r.admin_note,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    reviewedAt: r.reviewed_at,
  };
}

export type PartnerApplicationInput = {
  ownerName: string;
  nationalCode: string;
  cafeName: string;
  cafePhone: string;
  province: string;
  city: string;
  addressLine: string;
  licenseNumber?: string | null;
  instagram?: string | null;
};

export function getApplicationByCustomer(customerId: string): PartnerApplication | undefined {
  const row = db
    .prepare("SELECT * FROM partner_applications WHERE customer_id = ?")
    .get(customerId) as Row | undefined;
  return row ? mapRow(row) : undefined;
}

export function getApplicationById(id: string): PartnerApplication | undefined {
  const row = db.prepare("SELECT * FROM partner_applications WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? mapRow(row) : undefined;
}

/**
 * Creates the request, or re-submits it after a rejection.
 * Throws "ALREADY_PENDING" / "ALREADY_APPROVED" when a new request makes no sense.
 */
export function submitApplication(
  customerId: string,
  input: PartnerApplicationInput
): PartnerApplication {
  const existing = getApplicationByCustomer(customerId);
  if (existing?.status === "PENDING") throw new Error("ALREADY_PENDING");
  if (existing?.status === "APPROVED") throw new Error("ALREADY_APPROVED");

  const values = [
    input.ownerName,
    input.nationalCode,
    input.cafeName,
    input.cafePhone,
    input.province,
    input.city,
    input.addressLine,
    input.licenseNumber || null,
    input.instagram || null,
  ];

  if (existing) {
    db.prepare(
      `UPDATE partner_applications SET owner_name = ?, national_code = ?, cafe_name = ?, cafe_phone = ?,
         province = ?, city = ?, address_line = ?, license_number = ?, instagram = ?,
         status = 'PENDING', admin_note = NULL, reviewed_at = NULL, updated_at = datetime('now')
       WHERE id = ?`
    ).run(...values, existing.id);
    return getApplicationById(existing.id)!;
  }

  const id = newId("par");
  db.prepare(
    `INSERT INTO partner_applications
       (id, customer_id, owner_name, national_code, cafe_name, cafe_phone, province, city, address_line, license_number, instagram)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, customerId, ...values);
  return getApplicationById(id)!;
}

/** Admin decision. Approve promotes the customer to partner; reject / revoke demotes to regular. */
export function reviewApplication(
  id: string,
  decision: "APPROVED" | "REJECTED",
  adminNote: string | null
): PartnerApplication | undefined {
  const app = getApplicationById(id);
  if (!app) return undefined;

  const tx = db.transaction(() => {
    db.prepare(
      `UPDATE partner_applications SET status = ?, admin_note = ?, reviewed_at = datetime('now'),
         updated_at = datetime('now') WHERE id = ?`
    ).run(decision, adminNote, id);
    db.prepare("UPDATE customers SET customer_type = ? WHERE id = ?").run(
      decision === "APPROVED" ? "partner" : "regular",
      app.customerId
    );
  });
  tx();
  return getApplicationById(id);
}

export type AdminPartnerApplication = PartnerApplication & {
  customerPhone: string;
  customerName: string | null;
};

export function queryApplicationsForAdmin(filters: {
  q?: string;
  status?: PartnerStatus;
  page: number;
  perPage: number;
}): Paged<AdminPartnerApplication> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.status) {
    conditions.push("a.status = ?");
    params.push(filters.status);
  }
  if (filters.q) {
    const like = likePattern(filters.q);
    conditions.push(
      `(a.owner_name LIKE ? ESCAPE '\\' OR a.cafe_name LIKE ? ESCAPE '\\' OR c.phone LIKE ? ESCAPE '\\' OR a.cafe_phone LIKE ? ESCAPE '\\')`
    );
    params.push(like, like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { total } = db
    .prepare(
      `SELECT COUNT(*) as total FROM partner_applications a JOIN customers c ON c.id = a.customer_id ${where}`
    )
    .get(...params) as { total: number };
  const paged = buildPaged<AdminPartnerApplication>([], total, filters.page, filters.perPage);

  const rows = db
    .prepare(
      `SELECT a.*, c.phone as customer_phone, c.name as customer_name
       FROM partner_applications a JOIN customers c ON c.id = a.customer_id ${where}
       ORDER BY CASE a.status WHEN 'PENDING' THEN 0 ELSE 1 END, a.updated_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, filters.perPage, (paged.page - 1) * filters.perPage) as (Row & {
    customer_phone: string;
    customer_name: string | null;
  })[];

  paged.items = rows.map((r) => ({
    ...mapRow(r),
    customerPhone: r.customer_phone,
    customerName: r.customer_name,
  }));
  return paged;
}

export function countPendingApplications(): number {
  return (
    db
      .prepare("SELECT COUNT(*) as n FROM partner_applications WHERE status = 'PENDING'")
      .get() as { n: number }
  ).n;
}
