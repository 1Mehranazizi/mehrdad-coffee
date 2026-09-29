import { db } from "@/server/db/client";
import { newId } from "@/server/db/ids";
import { getVariantById, getProductById, effectivePrice } from "@/server/repo/products";
import {
  cartWeightGrams,
  PARTNER_MIN_WEIGHT_GRAMS,
  PARTNER_MIN_WEIGHT_LABEL,
} from "@/lib/partner";
import {
  buildPaged,
  likePattern,
  normalizeDigits,
  type Paged,
} from "@/lib/pagination";

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
  variantId: string | null;
  productName: string;
  weight: string;
  grindTypeName: string | null;
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
  variant_id: string | null;
  product_name: string;
  weight: string;
  grind_type_name: string | null;
  unit_price: number;
  quantity: number;
};

function mapItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    variantId: row.variant_id,
    productName: row.product_name,
    weight: row.weight,
    grindTypeName: row.grind_type_name,
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

export type AdminOrderRow = Omit<Order, "items"> & {
  itemCount: number;
  customerName: string | null;
  customerPhone: string | null;
};

const ORDER_STATUS_VALUES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUS_VALUES.includes(value as OrderStatus);
}

export function queryOrdersForAdmin(filters: {
  q?: string;
  status?: OrderStatus;
  page: number;
  perPage: number;
}): Paged<AdminOrderRow> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.status) {
    conditions.push("o.status = ?");
    params.push(filters.status);
  }
  const q = normalizeDigits(filters.q?.trim() ?? "");
  if (q) {
    const like = likePattern(q);
    conditions.push(
      `(o.order_number LIKE ? ESCAPE '\\' OR o.receiver_name LIKE ? ESCAPE '\\' OR o.receiver_phone LIKE ? ESCAPE '\\'
        OR c.phone LIKE ? ESCAPE '\\' OR c.name LIKE ? ESCAPE '\\')`
    );
    params.push(like, like, like, like, like);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { total } = db
    .prepare(
      `SELECT COUNT(*) as total FROM orders o JOIN customers c ON c.id = o.customer_id ${where}`
    )
    .get(...params) as { total: number };
  const paged = buildPaged<AdminOrderRow>([], total, filters.page, filters.perPage);

  const rows = db
    .prepare(
      `SELECT o.*, c.name as customer_name, c.phone as customer_phone,
              (SELECT COALESCE(SUM(quantity), 0) FROM order_items i WHERE i.order_id = o.id) as item_count
       FROM orders o JOIN customers c ON c.id = o.customer_id
       ${where}
       ORDER BY o.created_at DESC, o.rowid DESC
       LIMIT ? OFFSET ?`
    )
    .all(...params, filters.perPage, (paged.page - 1) * filters.perPage) as (OrderRow & {
    customer_name: string | null;
    customer_phone: string | null;
    item_count: number;
  })[];

  paged.items = rows.map((row) => {
    const { items: _items, ...order } = mapOrder(row, []);
    void _items;
    return {
      ...order,
      itemCount: row.item_count,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
    };
  });
  return paged;
}

export function countOrdersByStatus(): Record<OrderStatus, number> {
  const counts = Object.fromEntries(ORDER_STATUS_VALUES.map((s) => [s, 0])) as Record<
    OrderStatus,
    number
  >;
  const rows = db
    .prepare("SELECT status, COUNT(*) as n FROM orders GROUP BY status")
    .all() as { status: OrderStatus; n: number }[];
  for (const row of rows) counts[row.status] = row.n;
  return counts;
}

export function getOrderStats(): { orderCount: number; revenue: number } {
  const row = db
    .prepare(
      `SELECT COUNT(*) as order_count,
              COALESCE(SUM(CASE WHEN status NOT IN ('PENDING_PAYMENT','CANCELED') THEN total ELSE 0 END), 0) as revenue
       FROM orders`
    )
    .get() as { order_count: number; revenue: number };
  return { orderCount: row.order_count, revenue: row.revenue };
}

export type OrderDetail = Order & {
  customerName: string | null;
  customerPhone: string | null;
};

export function getOrderDetail(id: string): OrderDetail | undefined {
  const order = getOrderById(id);
  if (!order) return undefined;
  const customer = db
    .prepare("SELECT name, phone FROM customers WHERE id = ?")
    .get(order.customerId) as { name: string | null; phone: string } | undefined;
  return {
    ...order,
    customerName: customer?.name ?? null,
    customerPhone: customer?.phone ?? null,
  };
}

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `MH-${stamp}-${rand}`;
}


export type CreateOrderInput = {
  customerId: string;
  items: { variantId: string; quantity: number }[];
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode?: string;
  shippingCost: number;
  partner: boolean;
};

export type ResolvedCartItem = {
  productId: string;
  variantId: string;
  productName: string;
  weight: string;
  grindTypeName: string | null;
  unitPrice: number;
  quantity: number;
};

/** Looks up live prices/weights for cart lines; never trusts client-sent prices. */
export function resolveCartItems(
  cartItems: { variantId: string; quantity: number }[],
  partner = false
): { items?: ResolvedCartItem[]; error?: string } {
  if (cartItems.length === 0) return { error: "سبد خرید خالی است" };

  const resolved = cartItems.map((item) => {
    const variant = getVariantById(item.variantId);
    if (!variant) return null;
    const product = getProductById(variant.productId);
    if (!product || !product.published) return null;
    return {
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      weight: variant.weight,
      grindTypeName: variant.grindTypeName,
      unitPrice: effectivePrice(variant, partner),
      quantity: Math.max(1, Math.min(20, Number(item.quantity) || 1)),
    };
  });

  if (resolved.some((i) => i === null)) {
    return { error: "برخی از محصولات سبد خرید دیگر موجود نیستند" };
  }
  return { items: resolved as ResolvedCartItem[] };
}

export function createOrderFromCart(
  input: CreateOrderInput
): { order?: Order; error?: string } {
  const { items, error: resolveError } = resolveCartItems(input.items, input.partner);
  if (resolveError || !items) return { error: resolveError };

  if (input.partner && cartWeightGrams(items) < PARTNER_MIN_WEIGHT_GRAMS) {
    return { error: `حداقل خرید برای مشتریان همکار ${PARTNER_MIN_WEIGHT_LABEL} است` };
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingCost = input.shippingCost;
  const total = subtotal + shippingCost;

  const orderId = newId("ord");
  const orderNumber = generateOrderNumber();

  const insertOrder = db.prepare(
    `INSERT INTO orders (id, order_number, status, customer_id, subtotal, shipping_cost, total, receiver_name, receiver_phone, province, city, address_line, postal_code)
     VALUES (?, ?, 'PENDING_PAYMENT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, weight, grind_type_name, unit_price, quantity)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
        item.variantId,
        item.productName,
        item.weight,
        item.grindTypeName,
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
