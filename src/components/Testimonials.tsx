import { Container, SectionHeader } from "./ui";

const reviews = [
  { name: "Raka P.", city: "Jakarta", rating: 5, text: "Bahan 240gsm-nya tebal dan jatuhnya enak banget. Sablonnya rapi, nggak retak setelah dicuci." },
  { name: "Nadia S.", city: "Bandung", rating: 5, text: "Pullover olive-nya hangat dan oversized pas. Pengiriman cepat, packing rapi." },
  { name: "Fajar A.", city: "Surabaya", rating: 4, text: "Crossbody bag-nya muat banyak, tahan air. Strap bisa diatur sesuai kebutuhan." },
];

export function Testimonials() {
  return (
    <section className="py-32">
      <Container>
        <SectionHeader tag="Reviews" title="Kata Mereka" />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-border-subtle bg-bg-card p-8">
              <div className="mb-4 text-accent" aria-label={`${r.rating} dari 5 bintang`}>
                {"★".repeat(r.rating)}
                <span className="text-text-muted">{"★".repeat(5 - r.rating)}</span>
              </div>
              <blockquote className="mb-6 text-[0.9rem] leading-[1.7] text-text-secondary">“{r.text}”</blockquote>
              <figcaption className="font-display text-[0.8rem] uppercase tracking-[1px]">
                {r.name} <span className="text-text-muted">— {r.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
