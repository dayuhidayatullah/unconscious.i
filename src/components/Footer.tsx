import { Container, Logo } from "./ui";

const socialLink =
  "flex h-10 w-10 items-center justify-center rounded-full border border-border-light text-base text-text-secondary transition-all duration-300 hover:border-accent hover:bg-accent-glow hover:text-accent";
const colTitle = "mb-6 font-display text-[0.8rem] font-semibold uppercase tracking-[2px] text-text-primary";
const colLink = "block py-1 text-[0.85rem] text-text-muted transition-colors duration-300 hover:text-accent";

const external = { target: "_blank", rel: "noopener noreferrer" };

const shopLinks = ["All Products", "Tees & Longsleeves", "Sweaters", "Outerwear", "Accessories"];
const infoLinks = ["About Us", "Size Guide", "Shipping Info", "Return Policy", "FAQ"];
const payments = ["BCA", "BNI", "Mandiri", "GoPay", "OVO"];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary pt-24 pb-8">
      <Container>
        <div className="mb-24 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo className="mb-6 inline-block" />
            <p className="mb-6 max-w-[320px] text-[0.9rem] leading-[1.7] text-text-secondary">
              Let your mind choose. Let Unconscious speak. Streetwear clothing brand yang mengekspresikan jiwa melalui
              fashion.
            </p>
            <div className="flex gap-2">
              <a href="https://instagram.com/unconscious.i" className={socialLink} aria-label="Instagram" {...external}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://linktr.ee/unconscioubrand" className={socialLink} aria-label="Linktree" {...external}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className={colTitle}>Shop</h4>
            {shopLinks.map((l) => (
              <a key={l} href="#products" className={colLink}>
                {l}
              </a>
            ))}
          </div>

          <div>
            <h4 className={colTitle}>Info</h4>
            {infoLinks.map((l) => (
              <a key={l} href="#" className={colLink}>
                {l}
              </a>
            ))}
          </div>

          <div>
            <h4 className={colTitle}>Contact</h4>
            <a href="https://instagram.com/unconscious.i" className={colLink} {...external}>
              Instagram DM
            </a>
            <a href="https://wa.me/6281234567890" className={colLink} {...external}>
              WhatsApp
            </a>
            <a href="mailto:hello@unconscious.id" className={colLink}>
              Email
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-center md:flex-row md:gap-0 md:text-left">
          <p className="text-[0.8rem] text-text-muted">© 2024 Unconscious. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {payments.map((p) => (
              <span key={p} className="rounded-sm border border-border-subtle px-2 py-1 text-xs text-text-muted">
                {p}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
