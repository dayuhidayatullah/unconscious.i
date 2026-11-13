import type { Product } from "../types";
import { formatPrice } from "../data/products";
import { LazyImage } from "./LazyImage";

interface ProductCardProps {
  product: Product;
  onQuickView: (p: Product) => void;
  wished: boolean;
  onToggleWish: (id: number) => void;
}

export function ProductCard({ product, onQuickView, wished, onToggleWish }: ProductCardProps) {
  return (
    <div className="group relative cursor-pointer animate-card-in nth-1:[animation-delay:100ms] nth-2:[animation-delay:200ms] nth-3:[animation-delay:300ms] nth-4:[animation-delay:400ms]">
      <div className="relative mb-4 aspect-3/4 overflow-hidden rounded-xl bg-bg-tertiary">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => onToggleWish(product.id)}
          aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          aria-pressed={wished}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-lg backdrop-blur transition-all duration-300 hover:scale-110 ${
            wished ? "text-[#ff4d6d]" : "text-white"
          }`}
        >
          {wished ? "♥" : "♡"}
        </button>
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-sm bg-accent px-2 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[1px] text-bg-primary">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-4 bottom-4 translate-y-2.5 rounded-lg bg-white/95 px-4 py-2 text-center font-display text-xs font-semibold uppercase tracking-[2px] text-bg-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-accent"
        >
          Quick View
        </button>
      </div>
      <div className="px-1">
        <div className="mb-2 text-xs uppercase tracking-[1px] text-text-muted">
          {product.category}
        </div>
        <div className="mb-1 font-display text-[0.9rem] font-semibold tracking-[0.5px] transition-colors duration-300 group-hover:text-accent">
          {product.name}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-semibold text-text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[0.85rem] text-text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
