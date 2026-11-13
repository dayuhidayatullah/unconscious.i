import type { Category, CategoryFilter } from "../types";
import { categories, products } from "../data/products";
import { Container, SectionHeader } from "./ui";

const countOf = (cat: Category) => products.filter((p) => cat.match.includes(p.category)).length;

export function Categories({ onSelect }: { onSelect: (f: CategoryFilter) => void }) {
  return (
    <section id="categories" className="py-32">
      <Container>
        <SectionHeader tag="Browse by" title="Categories" linkHref="#products" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              role="button"
              tabIndex={0}
              onClick={() => onSelect({ label: cat.name, cats: cat.match })}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect({ label: cat.name, cats: cat.match })}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover brightness-[0.6] transition-[transform,filter] duration-600 group-hover:scale-[1.08] group-hover:brightness-[0.4]"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 to-transparent to-60% p-8">
                <div className="mb-1 font-display text-2xl font-bold uppercase tracking-[1px]">{cat.name}</div>
                <div className="text-[0.8rem] tracking-[1px] text-text-secondary">{countOf(cat)} Products</div>
              </div>
              <div className="absolute top-4 right-4 flex h-10 w-10 -translate-y-2.5 items-center justify-center rounded-full bg-white/10 text-text-primary opacity-0 backdrop-blur-[10px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                →
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
