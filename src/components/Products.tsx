import type { Product } from "../types";
import { products } from "../data/products";
import { ProductCard } from "./ProductCard";
import { Container, SectionHeader } from "./ui";

export function Products({ onQuickView }: { onQuickView: (p: Product) => void }) {
  return (
    <section id="products" className="bg-bg-secondary py-32">
      <Container>
        <SectionHeader tag="Our Collection" title="Featured Products" linkHref="#" />
        <div className="grid grid-cols-2 gap-2 min-[481px]:gap-4 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      </Container>
    </section>
  );
}
