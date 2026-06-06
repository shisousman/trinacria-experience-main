import { Link, useNavigate } from "@tanstack/react-router";
import { Settings2, Mountain, Hotel, UtensilsCrossed, Layers, ChevronLeft, type LucideIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logoIcon from "@/assets/trinacria-icon.png";
import { setFlowStage, useUIState } from "@/lib/uiState";
import type { PoiCategory } from "@/data/pois";
import { useT, type TKey } from "@/lib/lang";

const CATEGORIES: { id: PoiCategory; labelKey: TKey; Icon: LucideIcon }[] = [
  { id: "scenic", labelKey: "cat.scenic", Icon: Mountain },
  { id: "lodging", labelKey: "cat.lodging", Icon: Hotel },
  { id: "dining", labelKey: "cat.dining", Icon: UtensilsCrossed },
];

/**
 * OmniHeader — unified Apple-style top bar.
 * Brand · dynamic context (e.g. "Discovering Lipari") · filter action.
 * Expands subtly on hover and slides up when the right sidebar opens.
 */
export function OmniHeader() {
  const {
    sidebarOpen,
    revealed,
    bookingOpen,
    tourActive,
    activeIslandName,
    filterCategories,
    toggleCategory,
    resetCategories,
    poiSelected,
  } = useUIState();
  const navigate = useNavigate();
  const t = useT();
  const hidden = sidebarOpen || bookingOpen || tourActive || poiSelected || !revealed;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setFiltersOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [filtersOpen]);

  const allOff = filterCategories.size === 0;

  return (
    <div
      ref={containerRef}
      className={`fixed left-1/2 top-6 z-[100] -translate-x-1/2 px-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        hidden
          ? "pointer-events-none -translate-y-[150%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <nav
        className="apple-glass group pointer-events-auto flex w-[min(560px,86vw)] items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:w-[min(640px,92vw)]"
        style={{ color: "var(--cream-foreground)" }}
      >
        {/* Back to Islands */}
        <button
          onClick={() => {
            setFlowStage("carousel");
            navigate({ to: "/" });
          }}
          aria-label="Back to islands"
          className="flex shrink-0 items-center gap-1 rounded-full bg-white/40 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--navy-deep)] transition-all hover:bg-[var(--lemon)]"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
          <span className="hidden sm:inline">{t("header.back.islands")}</span>
        </button>

        {/* Brand */}
        <Link
          to="/"
          aria-label="Trinacria Experience — home"
          className="flex shrink-0 items-center gap-2.5 rounded-full pr-2 transition-transform hover:scale-[1.03]"
        >
          <img
            src={logoIcon}
            alt=""
            className="h-8 w-8 object-contain md:h-9 md:w-9"
            draggable={false}
          />
          <span className="font-instrument text-[28px] leading-none text-[var(--navy-deep)]">
            Trinacria.
          </span>
        </Link>

        {/* Dynamic center text */}
        <div className="min-w-0 flex-1 text-center">
          <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--cream-foreground-muted)]">
            {activeIslandName ? t("header.now") : t("header.brand")}
          </span>
          <span className="block truncate font-serif text-base font-medium leading-tight text-[var(--navy-deep)] md:text-lg">
            {activeIslandName ? activeIslandName : t("header.explore.sicily")}
          </span>
        </div>

        {/* Filter action */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          aria-label="Filters"
          aria-pressed={filtersOpen}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
            filtersOpen
              ? "bg-[var(--navy-deep)] text-[var(--lemon)]"
              : !allOff
                ? "bg-[var(--lemon)] text-[var(--navy-deep)]"
                : "hover:bg-[var(--lemon)]/25 text-[var(--navy-deep)]"
          }`}
        >
          <Settings2 className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {/* Filter popover */}
        <div
          className={`apple-glass absolute right-4 top-[calc(100%+0.75rem)] flex flex-col gap-1.5 rounded-3xl p-2 transition-all duration-300 ease-out ${
            filtersOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
          role="menu"
        >
          <button
            onClick={resetCategories}
            aria-pressed={allOff}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
              allOff
                ? "bg-[var(--navy-deep)] text-[var(--lemon)]"
                : "text-[var(--cream-foreground)] hover:bg-white/40"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {t("header.filters.all")}
          </button>
          {CATEGORIES.map(({ id, labelKey, Icon }) => {
            const isOn = filterCategories.has(id);
            return (
              <button
                key={id}
                onClick={() => toggleCategory(id)}
                aria-pressed={isOn}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                  isOn
                    ? "bg-[var(--lemon)] text-[var(--navy-deep)] shadow-[0_4px_18px_-6px_oklch(0.88_0.18_95/0.6)]"
                    : "text-[var(--cream-foreground)] hover:bg-white/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
