import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";

export type Review = {
  id: string;
  productId: string;
  customerId: string;
  customerName: string | null;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  product_id: string;
  customer_id: string;
  customer_name: string | null;
  rating: number;
  comment: string;
  approved: number;
  created_at: string;
};

function mapRow(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    approved: Boolean(row.approved),
    createdAt: row.created_at,
  };
}

export function listApprovedReviewsForProduct(productId: string): Review[] {
  const rows = db
    .prepare(
      `SELECT r.*, c.name as customer_name FROM reviews r
       JOIN customers c ON c.id = r.customer_id
       WHERE r.product_id = ? AND r.approved = 1
       ORDER BY r.created_at DESC`
    )
    .all(productId) as ReviewRow[];
  return rows.map(mapRow);
}

export function listReviewsForAdmin(onlyPending = false): (Review & {
  productName: string;
})[] {
  const rows = db
    .prepare(
      `SELECT r.*, c.name as customer_name, p.name as product_name FROM reviews r
       JOIN customers c ON c.id = r.customer_id
       JOIN products p ON p.id = r.product_id
       ${onlyPending ? "WHERE r.approved = 0" : ""}
       ORDER BY r.created_at DESC`
    )
    .all() as (ReviewRow & { product_name: string })[];
  return rows.map((row) => ({ ...mapRow(row), productName: row.product_name }));
}

export function hasCustomerReviewedProduct(
  customerId: string,
  productId: string
): boolean {
  const row = db
    .prepare(
      "SELECT 1 FROM reviews WHERE customer_id = ? AND product_id = ? LIMIT 1"
    )
    .get(customerId, productId);
  return Boolean(row);
}

export function createReview(input: {
  productId: string;
  customerId: string;
  rating: number;
  comment: string;
}): Review {
  const id = newId("rev");
  db.prepare(
    `INSERT INTO reviews (id, product_id, customer_id, rating, comment, approved)
     VALUES (?, ?, ?, ?, ?, 0)`
  ).run(id, input.productId, input.customerId, input.rating, input.comment);
  const row = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as ReviewRow;
  return mapRow(row);
}

export function setReviewApproval(id: string, approved: boolean): void {
  db.prepare("UPDATE reviews SET approved = ? WHERE id = ?").run(
    approved ? 1 : 0,
    id
  );
}

export function deleteReview(id: string): void {
  db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
}
