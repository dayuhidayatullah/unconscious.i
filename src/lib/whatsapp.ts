import type { CartItem } from "../types";
import { formatPrice } from "../data/products";

// Ganti dengan nomor WhatsApp toko (format internasional, tanpa + atau spasi).
export const WA_NUMBER = "6281234567890";

interface Summary {
  total: number;
  discount: number;
  shipping: number;
  promoCode?: string | null;
  orderId?: number;
}

export function buildWhatsAppUrl(cart: CartItem[], s: Summary): string {
  const lines = cart.map(
    (item, i) =>
      `${i + 1}. ${item.name} (${item.selectedSize}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
  );
  const extra: string[] = [];
  if (s.discount > 0) extra.push(`Promo ${s.promoCode}: -${formatPrice(s.discount)}`);
  extra.push(`Ongkir: ${s.shipping === 0 ? "GRATIS" : formatPrice(s.shipping)}`);
  const text = [
    s.orderId
      ? `Halo UNCONSCIOUS.I, saya mau konfirmasi order #${s.orderId}:`
      : "Halo UNCONSCIOUS.I, saya mau order:",
    "",
    ...lines,
    "",
    ...extra,
    `Total: ${formatPrice(s.total)}`,
  ].join("\n");
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
