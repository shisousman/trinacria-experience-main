import { Mountain, Hotel, UtensilsCrossed, Layers, type LucideIcon } from "lucide-react";
import type { PoiCategory } from "@/data/pois";

export const CATEGORIES: {
  id: PoiCategory;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "scenic", label: "Scenic Views", Icon: Mountain },
  { id: "lodging", label: "Lodging", Icon: Hotel },
  { id: "dining", label: "Dining", Icon: UtensilsCrossed },
];

interface Props {
  active: Set<PoiCategory>;
  onToggle: (cat: PoiCategory) => void;
  onReset: () => void;
}

/**
 * Floating Apple-glass filter bar — pinned to top center over the map.
 * "All" resets to show every category at full saturation; individual pills
 * toggle category isolation (non-matching pins desaturate on the map).
 */
export function FilterBar({ active, onToggle, onReset }: Props) {
  const allOff = active.size === 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[600] flex justify-center px-4">
      <div className="apple-glass pointer-events-auto flex items-center gap-1.5 rounded-full p-1.5 shadow-lg">
        <button
          onClick={onReset}
          aria-pressed={allOff}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
            allOff
              ? "bg-[var(--navy-deep)] text-[var(--lemon)]"
              : "text-[var(--cream-foreground)] hover:bg-white/40"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          All
        </button>
        {CATEGORIES.map(({ id, label, Icon }) => {
          const isOn = active.has(id);
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              aria-pressed={isOn}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                isOn
                  ? "bg-[var(--lemon)] text-[var(--navy-deep)] shadow-[0_4px_18px_-6px_oklch(0.88_0.18_95/0.6)]"
                  : "text-[var(--cream-foreground)] hover:bg-white/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
