import { useEffect, useState } from "react";
import { Container } from "./ui";

// Ganti dengan tanggal rilis koleksi berikutnya.
const DROP_DATE = new Date("2026-12-05T19:00:00+07:00").getTime();

const pad = (n: number) => String(n).padStart(2, "0");

export function DropCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = DROP_DATE - now;
  if (diff <= 0) return null;

  const s = Math.floor(diff / 1000);
  const units = [
    ["Hari", Math.floor(s / 86400)],
    ["Jam", Math.floor((s % 86400) / 3600)],
    ["Menit", Math.floor((s % 3600) / 60)],
    ["Detik", s % 60],
  ] as const;

  return (
    <section className="border-y border-border-subtle bg-bg-primary py-16">
      <Container>
        <div className="text-center">
          <div className="mb-2 font-display text-[0.7rem] uppercase tracking-[4px] text-accent">Next Drop</div>
          <h2 className="mb-8 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold">Winter Collection 2026</h2>
          <div className="flex justify-center gap-3 md:gap-6" role="timer" aria-live="off">
            {units.map(([label, value]) => (
              <div
                key={label}
                className="w-18 rounded-xl border border-border-light bg-bg-tertiary py-4 md:w-24 md:py-6"
              >
                <div className="font-display text-2xl font-bold tabular-nums md:text-4xl">{pad(value)}</div>
                <div className="mt-1 text-[0.65rem] uppercase tracking-[2px] text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
