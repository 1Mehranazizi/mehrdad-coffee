import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";
import {
  buildPaged,
  likePattern,
  normalizeDigits,
  type Paged,
} from "@/lib/pagination";

import type { CustomerType } from "@/lib/partner";

export type Customer = {
  id: string;
  phone: string;
  name: string | null;
  type: CustomerType;
  createdAt: string;
};

type CustomerRow = {
  id: string;
  phone: string;
  name: string | null;
  customer_type: string;
  created_at: string;
};

function mapRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    type: row.customer_type === "partner" ? "partner" : "regular",
    createdAt: row.created_at,
  };
}

export function isPartnerCustomer(customer: { type: CustomerType } | null | undefined): boolean {
  return customer?.type === "partner";
}

/** Admin: set the customer type directly (e.g. demote a partner). */
export function setCustomerType(id: string, type: CustomerType): void {
  db.prepare("UPDATE customers SET customer_type = ? WHERE id = ?").run(type, id);
}

export function getCustomerByPhone(phone: string): Customer | undefined {
  const row = db
    .prepare("SELECT * FROM customers WHERE phone = ?")
    .get(phone) as CustomerRow | undefined;
  return row ? mapRow(row) : undefined;
}

export function getCustomerById(id: string): Customer | undefined {
  const row = db.prepare("SELECT * FROM customers WHERE id = ?").get(id) as
    | CustomerRow
    | undefined;
  return row ? mapRow(row) : undefined;
}

export function getOrCreateCustomerByPhone(phone: string): Customer {
  const existing = getCustomerByPhone(phone);
  if (existing) return existing;
  const id = newId("cus");
  db.prepare("INSERT INTO customers (id, phone) VALUES (?, ?)").run(id, phone);
  return getCustomerById(id)!;
}

export function updateCustomerName(id: string, name: string): void {
  db.prepare("UPDATE customers SET name = ? WHERE id = ?").run(name, id);
}

export function listCustomersForAdmin(): (Customer & {
  orderCount: number;
})[] {
  const rows = db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
       FROM customers c ORDER BY c.created_at DESC`
    )
    .all() as (CustomerRow & { order_count: number })[];
  return rows.map((row) => ({ ...mapRow(row), orderCount: row.order_count }));
}

export type AdminCustomer = Customer & { orderCount: number };

export function queryCustomersForAdmin(filters: {
  q?: string;
  page: number;
  perPage: number;
}): Paged<AdminCustomer> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  const q = normalizeDigits(filters.q?.trim() ?? "");
  if (q) {
    conditions.push("(c.phone LIKE ? ESCAPE '\\' OR c.name LIKE ? ESCAPE '\\')");
    params.push(likePattern(q), likePattern(q));
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { total } = db
    .prepare(`SELECT COUNT(*) as total FROM customers c ${where}`)
    .get(...params) as { total: number };
  const paged = buildPaged<AdminCustomer>([], total, filters.page, filters.perPage);

  const rows = db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as order_count
       FROM customers c ${where}
       ORDER BY c.created_at DESC, c.rowid DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, filters.perPage, (paged.page - 1) * filters.perPage) as (CustomerRow & {
    order_count: number;
  })[];

  paged.items = rows.map((row) => ({ ...mapRow(row), orderCount: row.order_count }));
  return paged;
}

export function countCustomers(): number {
  return (db.prepare("SELECT COUNT(*) as n FROM customers").get() as { n: number }).n;
}

/** Admin-created customer. Throws "PHONE_EXISTS" if the number is already registered. */
export function createCustomer(input: { phone: string; name: string | null }): Customer {
  if (getCustomerByPhone(input.phone)) throw new Error("PHONE_EXISTS");
  const id = newId("cus");
  db.prepare("INSERT INTO customers (id, phone, name) VALUES (?, ?, ?)").run(
    id,
    input.phone,
    input.name
  );
  return getCustomerById(id)!;
}

/** Throws "PHONE_EXISTS" if the new phone belongs to another customer. */
export function updateCustomer(
  id: string,
  input: { phone: string; name: string | null }
): Customer | undefined {
  const existing = getCustomerByPhone(input.phone);
  if (existing && existing.id !== id) throw new Error("PHONE_EXISTS");
  db.prepare("UPDATE customers SET phone = ?, name = ? WHERE id = ?").run(
    input.phone,
    input.name,
    id
  );
  return getCustomerById(id);
}

export function hasCustomerPurchasedProduct(
  customerId: string,
  productId: string
): boolean {
  const row = db
    .prepare(
      `SELECT 1 FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.customer_id = ? AND oi.product_id = ? AND o.status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
       LIMIT 1`
    )
    .get(customerId, productId);
  return Boolean(row);
}
