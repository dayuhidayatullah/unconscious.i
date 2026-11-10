import { sectionTag } from "../lib/classes";
import { Container } from "./ui";

export function Newsletter({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <section className="relative overflow-hidden py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-135 from-bg-tertiary to-bg-card px-6 py-12 text-center before:pointer-events-none before:absolute before:-top-1/2 before:-right-[20%] before:h-[400px] before:w-[400px] before:bg-radial before:from-accent-glow before:to-transparent before:to-70% after:pointer-events-none after:absolute after:-bottom-[30%] after:-left-[10%] after:h-[300px] after:w-[300px] after:bg-radial after:from-accent/5 after:to-transparent after:to-70% md:p-24">
          <div className="relative z-[1] mx-auto max-w-[500px]">
            <div className={sectionTag}>Stay Updated</div>
            <h2 className="mb-4 font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold tracking-[-0.5px]">
              Join The Movement
            </h2>
            <p className="mb-8 text-[0.95rem] leading-[1.7] text-text-secondary">
              Dapatkan update koleksi terbaru, exclusive drops, dan promo spesial langsung ke inbox kamu.
            </p>
            <form
              className="flex flex-col gap-2 md:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                onSubscribe();
              }}
            >
              <input
                type="email"
                placeholder="Email address"
                required
                className="flex-1 rounded-lg border border-border-light bg-bg-primary px-6 py-4 font-body text-[0.9rem] text-text-primary outline-none transition-colors duration-300 placeholder:text-text-muted focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-lg bg-accent px-8 py-4 font-display text-[0.8rem] font-semibold uppercase tracking-[1px] whitespace-nowrap text-bg-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
