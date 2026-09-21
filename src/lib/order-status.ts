import type { OrderStatus } from "@/server/repo/orders";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  PAID: "پرداخت‌شده",
  PROCESSING: "در حال آماده‌سازی",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل داده‌شده",
  CANCELED: "لغو شده",
};

export const orderStatusOptions: { value: OrderStatus; label: string }[] = (
  Object.keys(orderStatusLabels) as OrderStatus[]
).map((value) => ({ value, label: orderStatusLabels[value] }));

export const ORDER_STATUSES = Object.keys(orderStatusLabels) as OrderStatus[];

export const orderStatusBadge: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PAID: "bg-sky-100 text-sky-800",
  PROCESSING: "bg-violet-100 text-violet-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELED: "bg-red-100 text-red-800",
};
