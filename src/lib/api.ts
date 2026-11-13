import type { Product } from "../types";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.error ?? "Terjadi kesalahan");
  return body as T;
}

export interface OrderInput {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  promoCode?: string | null;
  items: { productId: number; size: string; quantity: number }[];
}

export interface OrderResult {
  id: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode: string | null;
}

export const api = {
  products: () => request<Product[]>("/products"),
  subscribe: (email: string) =>
    request<{ ok: true }>("/newsletter", { method: "POST", body: JSON.stringify({ email }) }),
  validatePromo: (code: string) =>
    request<{ code: string; percent: number }>("/promo/validate", { method: "POST", body: JSON.stringify({ code }) }),
  createOrder: (order: OrderInput) =>
    request<OrderResult>("/orders", { method: "POST", body: JSON.stringify(order) }),
};
