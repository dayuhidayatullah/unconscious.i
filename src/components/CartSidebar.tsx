import { useState } from "react";
import type { CartItem } from "../types";
import { formatPrice } from "../data/products";
import { btnBlock, btnOutline } from "../lib/classes";
import { useModal } from "../lib/useModal";
import { FREE_SHIPPING_THRESHOLD, computeTotals, type AppliedPromo } from "../lib/promo";
import { LazyImage } from "./LazyImage";
import { loadDetails, type CheckoutDetails } from "../lib/checkoutDetails";

const fieldClass =
  "w-full rounded-lg border border-border-light bg-bg-tertiary px-4 py-3 text-[0.85rem] text-text-primary outline-none placeholder:text-text-muted focus:border-accent";

interface CartSidebarProps {
  open: boolean;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  promo: AppliedPromo | null;
  onApplyPromo: (code: string) => Promise<string | null>;
  onRemovePromo: () => void;
  onClose: () => void;
  onRemove: (id: number, size: string) => void;
  onChangeQty: (id: number, size: string, delta: number) => void;
  onCheckout: (details: CheckoutDetails) => Promise<void>;
}

export function CartSidebar({
  open,
  cart,
  cartCount,
  cartSubtotal,
  promo,
  onApplyPromo,
  onRemovePromo,
  onClose,
  onRemove,
  onChangeQty,
  onCheckout,
}: CartSidebarProps) {
  const ref = useModal<HTMLElement>(open, onClose);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [details, setDetails] = useState<CheckoutDetails>(() => loadDetails());
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  if (!open) return null;

  const { discount, shipping, total, afterDiscount } = computeTotals(cartSubtotal, promo);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);
  const progress = Math.min(100, (afterDiscount / FREE_SHIPPING_THRESHOLD) * 100);

  const applyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const err = await onApplyPromo(input);
    setError(err ?? "");
    if (!err) setInput("");
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setCheckoutError("");
    try {
      await onCheckout(details);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Gagal membuat pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-3000 animate-fade-in bg-black/70" />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-3001 flex w-105 max-w-full animate-slide-in-right flex-col border-l border-border-subtle bg-bg-secondary outline-none"
      >
        <div className="flex items-center justify-between border-b border-border-subtle p-8">
          <h3 className="font-display text-[1.1rem] font-semibold uppercase tracking-[2px]">Cart ({cartCount})</h3>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light text-text-secondary transition-all duration-300 hover:border-text-primary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {cart.length > 0 && (
          <div className="border-b border-border-subtle px-8 py-4">
            <p className="mb-2 text-[0.8rem] text-text-secondary">
              {remaining === 0 ? (
                <span className="text-accent">🎉 Selamat! Kamu dapat gratis ongkir.</span>
              ) : (
                <>
                  Belanja <b className="text-text-primary">{formatPrice(remaining)}</b> lagi untuk gratis ongkir
                </>
              )}
            </p>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              className="h-1.5 overflow-hidden rounded-full bg-white/10"
            >
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-[0.9rem] text-text-muted">
              <div className="text-5xl opacity-30">🛒</div>
              <p>Keranjang kamu masih kosong</p>
              <button onClick={onClose} className={`${btnOutline} mt-2`}>
                Mulai Belanja
              </button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={`${item.id}-${item.selectedSize}-${i}`} className="flex gap-4 border-b border-border-subtle py-4">
                <div className="h-25 w-20 shrink-0 overflow-hidden rounded-lg">
                  <LazyImage src={item.image} alt={item.name} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 font-display text-[0.85rem] font-semibold">{item.name}</div>
                  <div className="mb-2 text-xs text-text-muted">Size: {item.selectedSize}</div>
                  <div className="mb-2 flex items-center gap-3">
                    <button
                      onClick={() => onChangeQty(item.id, item.selectedSize, -1)}
                      disabled={item.quantity <= 1}
                      aria-label="Kurangi jumlah"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border-light text-text-secondary transition-colors duration-300 hover:border-text-primary hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="min-w-4 text-center font-display text-[0.85rem]">{item.quantity}</span>
                    <button
                      onClick={() => onChangeQty(item.id, item.selectedSize, 1)}
                      disabled={item.quantity >= 10}
                      aria-label="Tambah jumlah"
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border-light text-text-secondary transition-colors duration-300 hover:border-text-primary hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-display font-semibold text-accent">{formatPrice(item.price * item.quantity)}</div>
                </div>
                <button
                  onClick={() => onRemove(item.id, item.selectedSize)}
                  aria-label="Remove item"
                  className="self-start p-1 text-[0.8rem] text-text-muted transition-colors duration-300 hover:text-[#ff4444]"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="max-h-[65vh] overflow-y-auto border-t border-border-subtle p-8">
            {promo ? (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-border-accent bg-accent-glow px-4 py-3 text-[0.8rem]">
                <span>
                  <b className="text-accent">{promo.code}</b> — Diskon {promo.percent}%
                </span>
                <button onClick={onRemovePromo} className="text-text-muted underline">
                  Hapus
                </button>
              </div>
            ) : (
              <form onSubmit={applyPromo} className="mb-4">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setError("");
                    }}
                    placeholder="Kode promo"
                    aria-label="Kode promo"
                    className="min-w-0 flex-1 rounded-lg border border-border-light bg-bg-tertiary px-4 py-3 text-[0.85rem] uppercase text-text-primary outline-none placeholder:normal-case placeholder:text-text-muted focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-border-light px-4 font-display text-xs uppercase tracking-[1px] hover:border-accent hover:text-accent"
                  >
                    Pakai
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-[#ff4444]">{error}</p>}
              </form>
            )}

            <dl className="mb-6 space-y-2 text-[0.85rem] text-text-secondary">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(cartSubtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <dt>Diskon</dt>
                  <dd>−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Ongkir</dt>
                <dd>{shipping === 0 ? "GRATIS" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-text-primary">
                <dt className="font-display uppercase tracking-[1px]">Total</dt>
                <dd className="font-display text-[1.3rem] font-bold">{formatPrice(total)}</dd>
              </div>
            </dl>
            <form onSubmit={submitOrder} className="space-y-3">
              {(["customerName", "phone"] as const).map((f) => (
                <input
                  key={f}
                  name={f}
                  required
                  value={details[f]}
                  onChange={(e) => setDetails((d) => ({ ...d, [f]: e.target.value }))}
                  placeholder={f === "customerName" ? "Nama lengkap" : "No. WhatsApp (08xxxxxxxxxx)"}
                  aria-label={f === "customerName" ? "Nama lengkap" : "Nomor telepon"}
                  type={f === "phone" ? "tel" : "text"}
                  className={fieldClass}
                />
              ))}
              <textarea
                name="address"
                required
                minLength={10}
                rows={2}
                value={details.address}
                onChange={(e) => setDetails((d) => ({ ...d, address: e.target.value }))}
                placeholder="Alamat lengkap pengiriman"
                aria-label="Alamat pengiriman"
                className={fieldClass}
              />
              {checkoutError && <p className="text-xs text-[#ff4444]">{checkoutError}</p>}
              <button type="submit" disabled={submitting} className={`${btnBlock} disabled:opacity-50`}>
                {submitting ? "Memproses..." : "Pesan via WhatsApp"}
              </button>
            </form>
          </div>
        )}
      </aside>
    </>
  );
}
