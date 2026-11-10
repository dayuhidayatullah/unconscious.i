export function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-8 left-1/2 z-5000 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border-accent bg-bg-tertiary px-8 py-4 font-display text-[0.85rem] text-text-primary transition-all duration-400 ${
        message ? "translate-y-0 opacity-100" : "translate-y-25 opacity-0"
      }`}
    >
      <span className="text-accent">✓</span> {message}
    </div>
  );
}
