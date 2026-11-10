import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed right-8 bottom-8 z-100 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[1.2rem] text-bg-primary shadow-glow transition-all duration-300 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100 hover:-translate-y-1"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
    >
      ↑
    </button>
  );
}
