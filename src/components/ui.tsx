import type { ReactNode } from "react";
import { sectionTag } from "../lib/classes";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1400px] px-4 md:px-8 ${className}`}>{children}</div>;
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#"
      className={`relative font-display text-2xl font-bold uppercase tracking-[4px] text-text-primary ${className}`}
    >
      UNCONSCIOUS<span className="text-accent">.</span>I
    </a>
  );
}

interface SectionHeaderProps {
  tag: string;
  title: string;
  linkHref?: string;
}

export function SectionHeader({ tag, title, linkHref }: SectionHeaderProps) {
  return (
    <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-0">
      <div>
        <div className={sectionTag}>{tag}</div>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-bold tracking-[-1px]">
          {title}
        </h2>
      </div>
      {linkHref && (
        <a
          href={linkHref}
          className="group flex shrink-0 items-center gap-2 font-display text-[0.8rem] font-medium uppercase tracking-[2px] text-text-secondary transition-colors duration-300 hover:text-accent"
        >
          View All{" "}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      )}
    </div>
  );
}
