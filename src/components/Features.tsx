import { Container } from "./ui";

const features = [
  { icon: "🚚", title: "Free Shipping", desc: "Gratis ongkir untuk pembelian di atas Rp 500.000" },
  { icon: "✨", title: "Premium Quality", desc: "Material premium dengan detail finishing yang rapi" },
  { icon: "🔄", title: "Easy Return", desc: "Pengembalian mudah dalam 7 hari setelah penerimaan" },
  { icon: "💬", title: "24/7 Support", desc: "Customer service siap membantu kapan saja via DM" },
];

export function Features() {
  return (
    <section id="about" className="border-y border-border-subtle bg-bg-secondary py-32">
      <Container>
        <div className="grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((f) => (
            <div key={f.title} className="px-6 py-12 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-border-accent bg-accent-glow text-[1.4rem] text-accent">
                {f.icon}
              </div>
              <div className="mb-2 font-display text-base font-semibold tracking-[0.5px]">{f.title}</div>
              <div className="text-[0.85rem] leading-[1.6] text-text-muted">{f.desc}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
