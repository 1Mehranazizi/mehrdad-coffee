import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";
import { getProductById, getProductVariant } from "@/server/repo/products";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  weight: string;
  grind: string | null;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerId: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string | null;
  paymentAuthority: string | null;
  paymentRefId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

type OrderRow = {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_id: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  city: string;
  address_line: string;
  postal_code: string | null;
  payment_authority: string | null;
  payment_ref_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  weight: string;
  grind: string | null;
  unit_price: number;
  quantity: number;
};

function mapItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    weight: row.weight,
    grind: row.grind,
    unitPrice: row.unit_price,
    quantity: row.quantity,
  };
}

function mapOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    customerId: row.customer_id,
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    total: row.total,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    province: row.province,
    city: row.city,
    addressLine: row.address_line,
    postalCode: row.postal_code,
    paymentAuthority: row.payment_authority,
    paymentRefId: row.payment_ref_id,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  };
}

function getItemsForOrder(orderId: string): OrderItem[] {
  const rows = db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(orderId) as OrderItemRow[];
  return rows.map(mapItem);
}

export function getOrderById(id: string): Order | undefined {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | OrderRow
    | undefined;
  if (!row) return undefined;
  return mapOrder(row, getItemsForOrder(row.id));
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  const row = db
    .prepare("SELECT * FROM orders WHERE order_number = ?")
    .get(orderNumber) as OrderRow | undefined;
  if (!row) return undefined;
  return mapOrder(row, getItemsForOrder(row.id));
}

export function listOrdersByCustomer(customerId: string): Order[] {
  const rows = db
    .prepare(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC"
    )
    .all(customerId) as OrderRow[];
  return rows.map((row) => mapOrder(row, getItemsForOrder(row.id)));
}

export function listOrdersForAdmin(status?: OrderStatus): Order[] {
  const rows = status
    ? (db
        .prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC")
        .all(status) as OrderRow[])
    : (db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all() as OrderRow[]);
  return rows.map((row) => mapOrder(row, getItemsForOrder(row.id)));
}

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `MH-${stamp}-${rand}`;
}

const SHIPPING_COST = 45000;
const FREE_SHIPPING_THRESHOLD = 1500000;

export type CreateOrderInput = {
  customerId: string;
  items: { productId: string; variantId?: string; quantity: number }[];
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode?: string;
};

export function createOrderFromCart(
  input: CreateOrderInput
): { order?: Order; error?: string } {
  if (input.items.length === 0) return { error: "سبد خرید خالی است" };

  const resolvedItems = input.items.map((item) => {
    const product = getProductById(item.productId);
    const variant = item.variantId ? getProductVariant(item.variantId) : undefined;
    if (!product || !product.published || (variant && (variant.productId !== product.id || !variant.active))) return null;
    const selected = variant ?? {
      id: `legacy_${product.id}`,
      productId: product.id,
      weight: product.weight,
      grindOptionId: null,
      grind: null,
      price: product.price,
      active: true,
    };
    return {
      productId: product.id,
      productName: product.name,
      weight: selected.weight,
      grind: selected.grind,
      unitPrice: selected.price,
      quantity: Math.max(1, Math.min(20, item.quantity)),
    };
  });

  if (resolvedItems.some((i) => i === null)) {
    return { error: "برخی از محصولات سبد خرید دیگر موجود نیستند" };
  }

  const items = resolvedItems as NonNullable<(typeof resolvedItems)[number]>[];
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const orderId = newId("ord");
  const orderNumber = generateOrderNumber();

  const insertOrder = db.prepare(
    `INSERT INTO orders (id, order_number, status, customer_id, subtotal, shipping_cost, total, receiver_name, receiver_phone, province, city, address_line, postal_code)
     VALUES (?, ?, 'PENDING_PAYMENT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (id, order_id, product_id, product_name, weight, grind, unit_price, quantity)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    insertOrder.run(
      orderId,
      orderNumber,
      input.customerId,
      subtotal,
      shippingCost,
      total,
      input.receiverName,
      input.receiverPhone,
      input.province,
      input.city,
      input.addressLine,
      input.postalCode ?? null
    );
    for (const item of items) {
      insertItem.run(
        newId("item"),
        orderId,
        item.productId,
        item.productName,
        item.weight,
        item.grind,
        item.unitPrice,
        item.quantity
      );
    }
  });
  tx();

  return { order: getOrderById(orderId) };
}

export function setOrderPaymentAuthority(
  orderId: string,
  authority: string
): void {
  db.prepare(
    "UPDATE orders SET payment_authority = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(authority, orderId);
}

export function markOrderPaid(orderId: string, refId: string): void {
  db.prepare(
    `UPDATE orders SET status = 'PAID', payment_ref_id = ?, paid_at = datetime('now'), updated_at = datetime('now')
     WHERE id = ?`
  ).run(refId, orderId);
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  db.prepare(
    "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, orderId);
}

export function getOrderByAuthority(authority: string): Order | undefined {
  const row = db
    .prepare("SELECT * FROM orders WHERE payment_authority = ?")
    .get(authority) as OrderRow | undefined;
  if (!row) return undefined;
  return mapOrder(row, getItemsForOrder(row.id));
}
