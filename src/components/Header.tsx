import { useEffect, useState } from "react";
import { Container, Logo } from "./ui";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#categories", label: "Collection" },
  { href: "#products", label: "Shop" },
  { href: "#lookbook", label: "Lookbook" },
  { href: "#about", label: "About" },
];

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
}

export function Header({ cartCount, onCartOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed inset-x-0 top-0 z-1000 transition-all duration-400 ${
        scrolled
          ? "border-b border-border-subtle bg-bg-glass py-2 backdrop-blur-[20px]"
          : "bg-transparent py-4"
      }`}
    >
      <Container className="flex items-center justify-between">
        <Logo />

        <div
          className={`items-center gap-8 md:flex ${
            open
              ? "fixed inset-0 z-999 flex animate-fade-in flex-col justify-center gap-12 bg-bg-primary md:static md:animate-none md:flex-row md:gap-8 md:bg-transparent"
              : "hidden"
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`relative font-display font-medium uppercase text-text-secondary transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] after:duration-300 hover:text-text-primary hover:after:w-full ${
                open
                  ? "text-2xl tracking-[4px] md:text-[0.8rem] md:tracking-[2px]"
                  : "text-[0.8rem] tracking-[2px]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCartOpen}
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-light text-text-primary transition-all duration-300 hover:border-accent hover:text-accent"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[0.6rem] font-bold text-bg-primary">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="relative z-1000 flex w-7 flex-col gap-5px md:hidden"
          >
            <span
              className={`h-0.5 rounded-sm bg-text-primary transition-all duration-300 ${open ? "translate-x-1.25 translate-y-1.25 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 rounded-sm bg-text-primary transition-all duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 rounded-sm bg-text-primary transition-all duration-300 ${open ? "translate-x-1.25 -translate-y-1.25 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </Container>
    </nav>
  );
}
