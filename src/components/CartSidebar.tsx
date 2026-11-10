import type { CartItem } from "../types";
import { formatPrice } from "../data/products";
import { btnBlock, btnOutline } from "../lib/classes";

interface CartSidebarProps {
  open: boolean;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  onClose: () => void;
  onRemove: (id: number, size: string) => void;
  onCheckout: () => void;
}

export function CartSidebar({
  open,
  cart,
  cartCount,
  cartTotal,
  onClose,
  onRemove,
  onCheckout,
}: CartSidebarProps) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-3000 animate-fade-in bg-black/70"
      />
      <aside className="fixed inset-y-0 right-0 z-3001 flex w-105 max-w-full animate-slide-in-right flex-col border-l border-border-subtle bg-bg-secondary">
        <div className="flex items-center justify-between border-b border-border-subtle p-8">
          <h3 className="font-display text-[1.1rem] font-semibold uppercase tracking-[2px]">
            Cart ({cartCount})
          </h3>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light text-text-secondary transition-all duration-300 hover:border-text-primary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

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
              <div
                key={`${item.id}-${item.selectedSize}-${i}`}
                className="flex gap-4 border-b border-border-subtle py-4"
              >
                <div className="h-25 w-20 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 font-display text-[0.85rem] font-semibold">
                    {item.name}
                  </div>
                  <div className="mb-2 text-xs text-text-muted">
                    Size: {item.selectedSize} · Qty: {item.quantity}
                  </div>
                  <div className="font-display font-semibold text-accent">
                    {formatPrice(item.price * item.quantity)}
                  </div>
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
          <div className="border-t border-border-subtle p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-[0.85rem] uppercase tracking-[1px] text-text-secondary">
                Total
              </span>
              <span className="font-display text-[1.3rem] font-bold">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <button onClick={onCheckout} className={btnBlock}>
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
