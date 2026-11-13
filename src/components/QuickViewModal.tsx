import { useState } from "react";
import type { Product } from "../types";
import { formatPrice } from "../data/products";
import { btnBlock } from "../lib/classes";
import { useModal } from "../lib/useModal";
import { LazyImage } from "./LazyImage";
import { SizeGuide } from "./SizeGuide";

interface QuickViewModalProps {
  product: Product | null;
  selectedSize: string;
  onSelectSize: (s: string) => void;
  onClose: () => void;
  onAddToCart: (p: Product, size: string) => void;
}

export function QuickViewModal(props: QuickViewModalProps) {
  if (!props.product) return null;
  // key: reset galeri setiap ganti produk
  return <QuickViewContent key={props.product.id} {...props} product={props.product} />;
}

function QuickViewContent({
  product,
  selectedSize,
  onSelectSize,
  onClose,
  onAddToCart,
}: QuickViewModalProps & { product: Product }) {
  const [active, setActive] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const ref = useModal<HTMLDivElement>(!guideOpen, onClose);

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasSizeGuide = product.sizes.some((s) => s !== "ONE SIZE");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-2000 flex animate-fade-in items-center justify-center bg-black/85 p-8 backdrop-blur-[10px]"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-225 animate-scale-in grid-cols-1 overflow-hidden overflow-y-auto rounded-2xl border border-border-subtle bg-bg-secondary outline-none md:max-h-none md:grid-cols-2 md:overflow-y-hidden"
      >
        <div className="flex flex-col">
          <div className="aspect-square overflow-hidden md:aspect-3/4">
            <LazyImage key={gallery[active]} src={gallery[active]} alt={product.name} eager />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 p-3">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  aria-label={`Foto ${i + 1}`}
                  aria-current={i === active}
                  className={`h-16 w-14 overflow-hidden rounded-md border transition-colors ${
                    i === active ? "border-accent" : "border-border-light opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-12">
          <div className="mb-4 font-display text-[0.7rem] uppercase tracking-[3px] text-accent">
            {product.category}
          </div>
          <h2 className="mb-4 font-display text-[1.8rem] font-bold">{product.name}</h2>
          <div className="mb-8 flex items-center gap-4">
            <span className="font-display text-2xl font-bold text-accent">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-base text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="mb-8 text-[0.9rem] leading-[1.7] text-text-secondary">{product.description}</p>
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-xs font-semibold uppercase tracking-[2px] text-text-secondary">
                Size
              </span>
              {hasSizeGuide && (
                <button
                  onClick={() => setGuideOpen(true)}
                  className="text-xs text-accent underline underline-offset-4"
                >
                  Panduan ukuran
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onSelectSize(size)}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-lg border px-2 font-display text-[0.8rem] font-medium transition-all duration-200 hover:border-accent hover:bg-accent-glow hover:text-accent ${
                    selectedSize === size
                      ? "border-accent bg-accent-glow text-accent"
                      : "border-border-light text-text-secondary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => onAddToCart(product, selectedSize)} className={btnBlock}>
            Add to Cart — {formatPrice(product.price)}
          </button>
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[1.2rem] text-text-primary transition-all duration-300 hover:rotate-90 hover:bg-white/20"
      >
        ✕
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
      </div>
    </div>
  );
}
