// Nilai ini harus sama dengan FREE_SHIPPING_THRESHOLD / SHIPPING_FEE di server/.env.
// Server tetap menghitung ulang total saat order dibuat; ini hanya untuk tampilan.
export const FREE_SHIPPING_THRESHOLD = 750000;
export const SHIPPING_FEE = 25000;

export interface AppliedPromo {
  code: string;
  percent: number;
}

export function computeTotals(subtotal: number, promo: AppliedPromo | null) {
  const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { discount, shipping, total: afterDiscount + shipping, afterDiscount };
}
