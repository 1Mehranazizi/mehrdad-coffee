import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type Customer = {
  id: string;
  phone: string;
  name: string | null;
  createdAt: string;
};

type CustomerRow = {
  id: string;
  phone: string;
  name: string | null;
  created_at: string;
};

function mapRow(row: CustomerRow): Customer {
  return { id: row.id, phone: row.phone, name: row.name, createdAt: row.created_at };
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
