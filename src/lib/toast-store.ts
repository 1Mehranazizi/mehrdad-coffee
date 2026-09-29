"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastState = {
  toasts: ToastItem[];
  push: (type: ToastType, message: string, duration?: number) => number;
  dismiss: (id: number) => void;
};

let counter = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (type, message, duration = type === "error" ? 5000 : 3500) => {
    const id = ++counter;
    // keep at most 4 toasts on screen
    set((s) => ({ toasts: [...s.toasts.slice(-3), { id, type, message }] }));
    timers.set(
      id,
      setTimeout(() => get().dismiss(id), duration)
    );
    return id;
  },
  dismiss: (id) => {
    const t = timers.get(id);
    if (t) clearTimeout(t);
    timers.delete(id);
    set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
  },
}));

/** Use anywhere (event handlers, effects): toast.success("..."), toast.error("...") */
export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().push("success", message, duration),
  error: (message: string, duration?: number) =>
    useToastStore.getState().push("error", message, duration),
  info: (message: string, duration?: number) =>
    useToastStore.getState().push("info", message, duration),
};
