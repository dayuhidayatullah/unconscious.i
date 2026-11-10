import { Container, SectionHeader } from "./ui";

const looks = [
  {
    image: "/images/hero-lookbook.png",
    alt: "Lookbook",
    title: "Urban Night",
    desc: "Raw expression in the city after dark",
    cta: "Shop The Look",
    large: true,
  },
  {
    image: "/images/lookbook-two.png",
    alt: "Camo Collection",
    title: "Camo Series",
    desc: "Military-inspired streetwear",
    cta: "Explore",
  },
  {
    image: "/images/pullover-sweater.png",
    alt: "Knitwear",
    title: "Knitwear",
    desc: "Cozy oversized essentials",
    cta: "Explore",
  },
];

export function Lookbook() {
  return (
    <section id="lookbook" className="relative py-32">
      <Container>
        <SectionHeader tag="Editorial" title="Lookbook" />
        <div className="grid grid-cols-1 gap-4 md:min-h-150 md:grid-cols-2">
          {looks.map((look) => (
            <div
              key={look.title}
              className={`group relative overflow-hidden rounded-xl ${
                look.large
                  ? "aspect-3/4 md:row-span-2 md:aspect-auto"
                  : "aspect-video md:aspect-auto"
              }`}
            >
              <img
                src={look.image}
                alt={look.alt}
                className="h-full w-full object-cover transition-transform duration-800 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 to-transparent to-50% p-12">
                <h3 className="mb-2 font-display text-[1.8rem] font-bold uppercase tracking-[1px]">
                  {look.title}
                </h3>
                <p className="mb-4 text-[0.9rem] text-text-secondary">
                  {look.desc}
                </p>
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[2px] text-accent transition-[gap] duration-300 hover:gap-4"
                >
                  {look.cta} <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
