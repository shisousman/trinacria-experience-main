import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ISLANDS, type Island } from "@/data/pois";
import { setCarouselIndex, useUIState } from "@/lib/uiState";

interface Props {
  onEnterMap: (island: Island) => void;
  onBackHero: () => void;
}

/**
 * Full-screen, snap-x carousel that lets the user "swipe" between islands
 * before committing to a map view. Native-feeling on mobile, keyboard- and
 * mouse-friendly on desktop.
 */
export function IslandCarousel({ onEnterMap, onBackHero }: Props) {
  const { carouselIndex } = useUIState();
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Restore scroll to the previously focused island on mount.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: carouselIndex * el.clientWidth, behavior: "auto" });
    // Listen for scroll → publish active index.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setCarouselIndex(Math.max(0, Math.min(ISLANDS.length - 1, idx)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const prev = () => goTo(Math.max(0, carouselIndex - 1));
  const next = () => goTo(Math.min(ISLANDS.length - 1, carouselIndex + 1));

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[var(--navy-deep)]">
      {/* Back to hero (top-left) */}
      <button
        onClick={onBackHero}
        aria-label="Back to home"
        className="apple-glass absolute left-6 top-6 z-30 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cream-foreground)] transition-transform duration-300 hover:scale-[1.03]"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        Home
      </button>

      {/* Snap track */}
      <div
        ref={trackRef}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {ISLANDS.map((island, i) => (
          <article
            key={island.id}
            ref={(el: HTMLDivElement | null) => {
              slideRefs.current[i] = el;
            }}
            className="relative flex h-full w-full shrink-0 snap-center snap-always items-center justify-center overflow-hidden"
          >
            <img
              src={island.hero}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/75" />

            <div className="relative z-10 flex max-w-2xl flex-col items-center px-8 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--lemon)]/85">
                {island.tagline}
              </p>
              <h2 className="mt-4 font-serif text-5xl font-medium leading-[1.05] text-white md:text-6xl lg:text-7xl">
                {island.name}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
                {island.description}
              </p>

              <button
                onClick={() => onEnterMap(island)}
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/20 px-7 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[var(--lemon)] hover:text-[var(--navy-deep)]"
              >
                Enter Map
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Prev / Next chevrons (desktop affordance) */}
      {carouselIndex > 0 && (
        <button
          onClick={prev}
          aria-label="Previous island"
          className="apple-glass absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full p-3 text-[var(--cream-foreground)] transition-transform duration-300 hover:scale-105 md:inline-flex"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
      )}
      {carouselIndex < ISLANDS.length - 1 && (
        <button
          onClick={next}
          aria-label="Next island"
          className="apple-glass absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full p-3 text-[var(--cream-foreground)] transition-transform duration-300 hover:scale-105 md:inline-flex"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      )}

      {/* Dot pagination */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center">
        <div className="apple-glass pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5">
          {ISLANDS.map((island, i) => (
            <button
              key={island.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${island.name}`}
              aria-current={i === carouselIndex}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                i === carouselIndex
                  ? "w-6 bg-[var(--lemon)]"
                  : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
