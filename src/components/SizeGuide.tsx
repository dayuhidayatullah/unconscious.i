import { useModal } from "../lib/useModal";

const rows = [
  ["S", "52", "68", "72"],
  ["M", "54", "70", "74"],
  ["L", "56", "72", "76"],
  ["XL", "58", "74", "78"],
];

export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useModal<HTMLDivElement>(open, onClose);
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-2500 flex animate-fade-in items-center justify-center bg-black/80 p-6"
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Panduan ukuran"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-scale-in rounded-2xl border border-border-subtle bg-bg-secondary p-8"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold uppercase tracking-[2px]">Size Guide</h3>
          <button
            onClick={onClose}
            aria-label="Tutup panduan ukuran"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>
        <p className="mb-6 text-[0.8rem] text-text-muted">Ukuran dalam cm (oversized fit, ukur datar).</p>
        <table className="w-full text-center text-[0.85rem]">
          <thead>
            <tr className="border-b border-border-light font-display text-xs uppercase tracking-[1px] text-text-secondary">
              <th className="py-3">Size</th>
              <th>Lebar Dada</th>
              <th>Panjang</th>
              <th>Lengan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-border-subtle">
                <td className="py-3 font-display font-semibold text-accent">{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
