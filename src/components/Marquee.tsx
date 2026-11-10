const words = ["STREETWEAR", "UNCONSCIOUS", "AUTHENTIC", "RAW EXPRESSION", "LET YOUR MIND CHOOSE", "CLOTHING BRAND"];

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border-subtle bg-bg-secondary py-8">
      <div className="flex w-max animate-marquee">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-8 px-8 font-display text-[1.2rem] font-semibold uppercase tracking-[6px] whitespace-nowrap text-text-muted"
          >
            {words.map((word) => (
              <span key={word} className="flex items-center gap-8">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
