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
