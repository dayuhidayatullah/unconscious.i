import { useMemo, useState } from "react";
import type { CategoryFilter, Product } from "../types";
import { ProductCard } from "./ProductCard";
import { Container, SectionHeader } from "./ui";

type Sort = "default" | "price-asc" | "price-desc" | "name";



const chip = (active: boolean) =>
  `rounded-full border px-4 py-2 font-display text-[0.75rem] font-medium uppercase tracking-[1px] transition-all duration-300 ${
    active
      ? "border-accent bg-accent-glow text-accent"
      : "border-border-light text-text-secondary hover:border-text-primary hover:text-text-primary"
  }`;

interface ProductsProps {
  filter: CategoryFilter | null;
  onFilterChange: (f: CategoryFilter | null) => void;
  onQuickView: (p: Product) => void;
  products: Product[];
  wishlist: number[];
  onToggleWish: (id: number) => void;
}

export function Products({ products, filter, onFilterChange, onQuickView, wishlist, onToggleWish }: ProductsProps) {
  const productCategories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const [wishOnly, setWishOnly] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (!wishOnly || wishlist.includes(p.id)) &&
        (!filter || filter.cats.includes(p.category)) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
    );
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, filter, query, sort, wishOnly, wishlist]);

  const customLabel = filter && !productCategories.includes(filter.label) ? filter.label : null;

  return (
    <section id="products" className="bg-bg-secondary py-32">
      <Container>
        <SectionHeader tag="Our Collection" title="Featured Products" />

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onFilterChange(null)} className={chip(!filter)}>
              All
            </button>
            {productCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange({ label: cat, cats: [cat] })}
                className={chip(filter?.label === cat)}
              >
                {cat}
              </button>
            ))}
            <button onClick={() => setWishOnly((v) => !v)} aria-pressed={wishOnly} className={chip(wishOnly)}>
              ♥ Wishlist ({wishlist.length})
            </button>
            {customLabel && (
              <button onClick={() => onFilterChange(null)} className={chip(true)}>
                {customLabel} ✕
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 min-[481px]:flex-row">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              aria-label="Cari produk"
              className="rounded-lg border border-border-light bg-bg-tertiary px-4 py-3 text-[0.85rem] text-text-primary outline-none transition-colors duration-300 placeholder:text-text-muted focus:border-accent"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Urutkan produk"
              className="rounded-lg border border-border-light bg-bg-tertiary px-4 py-3 text-[0.85rem] text-text-primary outline-none transition-colors duration-300 focus:border-accent"
            >
              <option value="default">Urutkan: Terbaru</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="name">Nama: A–Z</option>
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center text-text-muted">
            <div className="text-5xl opacity-30">🔍</div>
            <p>Produk tidak ditemukan.</p>
            <button
              onClick={() => {
                setQuery("");
                setWishOnly(false);
                onFilterChange(null);
              }}
              className="text-[0.85rem] text-accent underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 min-[481px]:gap-4 lg:grid-cols-4 lg:gap-6">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                wished={wishlist.includes(product.id)}
                onToggleWish={onToggleWish}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
