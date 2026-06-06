import { X, MapPin, Compass, CalendarCheck } from "lucide-react";
import type { Poi } from "@/data/pois";
import { CATEGORIES } from "./FilterBar";

interface Props {
  poi: Poi | null;
  onClose: () => void;
  onOpenTour: () => void;
  onBook: () => void;
}

export function PoiPanel({ poi, onClose, onOpenTour, onBook }: Props) {
  const isOpen = !!poi;
  const meta = poi ? CATEGORIES.find((c) => c.id === poi.category) : null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[200] bg-[var(--navy-deep)]/60 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`apple-glass fixed inset-x-0 bottom-0 z-[200] max-h-[85vh] overflow-y-auto rounded-t-[2rem] transition-all duration-500 ease-out md:inset-y-auto md:bottom-6 md:left-6 md:right-auto md:max-h-[80vh] md:w-[380px] md:rounded-[2rem] ${
          isOpen
            ? "translate-y-0 opacity-100 md:translate-x-0"
            : "translate-y-full opacity-0 md:-translate-x-8 md:translate-y-0"
        }`}
        style={{ color: "var(--cream-foreground)" }}
        aria-hidden={!isOpen}
      >
        {poi && (
          <div className="flex flex-col">
            <div className="relative h-56 w-full overflow-hidden md:h-72">
              <img
                src={poi.image}
                alt={poi.name}
                className="h-full w-full object-cover"
                loading="lazy"
                width={900}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/80 text-foreground backdrop-blur-md transition hover:bg-card"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
              {meta && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-foreground backdrop-blur-md">
                  <meta.Icon className="h-3.5 w-3.5" /> {meta.label}
                </span>
              )}
            </div>

            <div className="space-y-5 p-6 md:p-8">
              <div>
                <h2 className="text-3xl font-semibold leading-tight">
                  {poi.name}
                </h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {poi.location}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {poi.description}
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={onOpenTour}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gradient-lemon)] px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110"
                >
                  <Compass className="h-4 w-4 transition group-hover:rotate-45" />
                  View 360° Tour
                </button>
                <button
                  onClick={onBook}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--lemon)]/40 bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground transition duration-300 ease-in-out hover:border-[var(--lemon)] hover:bg-muted hover:text-[var(--lemon)]"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Check Availability
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                {[
                  { k: "Rating", v: "4.9" },
                  { k: "Reviews", v: "312" },
                  { k: "Tours", v: "8" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-xl border border-border bg-background/40 px-3 py-3"
                  >
                    <div className="text-lg font-semibold text-primary">
                      {s.v}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.k}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
