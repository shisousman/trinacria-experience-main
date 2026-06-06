import { ISLANDS, type Island } from "@/data/pois";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUIState } from "@/lib/uiState";

interface Props {
  current: Island;
  onChange: (island: Island) => void;
}

/**
 * Apple-style horizontal pill scroller — minimal stadium-shaped buttons
 * with a tiny circular thumbnail. Floats over the map without blocking it.
 */
export function IslandPillScroller({ current, onChange }: Props) {
  const { revealed, bookingOpen, tourActive, sidebarOpen, poiSelected } = useUIState();
  const visible = revealed && !bookingOpen && !tourActive && !sidebarOpen && !poiSelected;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollMore, setCanScrollMore] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollMore = () => {
    scrollerRef.current?.scrollBy({ left: 240, behavior: "smooth" });
  };

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 transition-all duration-700 ease-in-out ${
        visible ? "bottom-6 opacity-100" : "pointer-events-none bottom-[-100px] opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex max-w-[92vw] items-center gap-2">
        <div
          ref={scrollerRef}
          className="flex items-center gap-2 overflow-x-auto rounded-full border border-white/30 bg-white/20 px-2 py-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] backdrop-blur-[24px] backdrop-saturate-150 scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {ISLANDS.map((island) => {
            const active = island.id === current.id;
            return (
              <button
                key={island.id}
                onClick={() => onChange(island)}
                aria-pressed={active}
                className={`group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-3 py-1.5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  active
                    ? "bg-yellow-400 text-[var(--navy-deep)] shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                    : "text-white/90 hover:bg-white/15"
                }`}
              >
                <img
                  src={island.hero}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-white/30"
                  draggable={false}
                />
                <span className="text-[13px] font-medium tracking-tight">
                  {island.name}
                </span>
                {active && (
                  <span className="ml-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--navy-deep)]" />
                )}
              </button>
            );
          })}
        </div>
        {canScrollMore && (
          <button
            onClick={scrollMore}
            aria-label="Scroll more islands"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-[24px] backdrop-saturate-150 transition-transform duration-300 hover:scale-105"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}
