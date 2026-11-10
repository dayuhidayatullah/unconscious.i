import { btnOutline, btnPrimary } from "../lib/classes";
import { Container } from "./ui";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex h-screen min-h-175 items-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1/2 before:z-1 before:h-[200%] before:w-[200%] before:animate-grain before:bg-grain before:opacity-50 after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,rgba(10,10,10,0.3)_0%,rgba(10,10,10,0.1)_40%,rgba(10,10,10,0.8)_80%,rgba(10,10,10,1)_100%)]">
        <img
          src="/images/hero-lookbook.png"
          alt="Unconscious Streetwear"
          className="h-full w-full object-cover brightness-[0.35] contrast-[1.1]"
        />
      </div>

      <Container>
        <div className="relative z-2 animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-border-accent bg-accent-glow px-4 py-2 font-display text-[0.7rem] font-medium uppercase tracking-[4px] text-accent before:h-1.5 before:w-1.5 before:animate-pulse-soft before:rounded-full before:bg-accent">
            New Collection 2024
          </div>
          <h1 className="mb-6 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-bold uppercase tracking-[-2px]">
            LET YOUR
            <br />
            <span className="text-outline">MIND</span>{" "}
            <span className="text-accent">CHOOSE</span>
          </h1>
          <p className="mb-12 max-w-120 text-[1.1rem] leading-[1.7] text-text-secondary">
            Let Unconscious speak. Streetwear yang lahir dari ekspresi bawah
            sadar — raw, authentic, dan tanpa batas.
          </p>
          <div className="flex items-center gap-4">
            <a href="#products" className={btnPrimary}>
              Shop Now
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#lookbook" className={btnOutline}>
              Lookbook
            </a>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-12 left-1/2 z-2 -translate-x-1/2">
        <div className="flex animate-float flex-col items-center gap-2 text-[0.7rem] uppercase tracking-[2px] text-text-muted">
          SCROLL
          <div className="h-10 w-px bg-linear-to-b from-text-muted to-transparent" />
        </div>
      </div>
    </section>
  );
}
