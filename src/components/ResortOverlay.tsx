import { X, MapPin, Compass, CalendarCheck, Star, BedDouble, Wifi, Coffee } from "lucide-react";
import { useEffect, useState } from "react";
import type { Poi } from "@/data/pois";

interface Props {
  poi: Poi | null;
  onClose: () => void;
  onOpenTour: () => void;
  onBook: () => void;
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "rooms", label: "Rooms" },
  { id: "location", label: "Location" },
] as const;

/**
 * Full-height glass overlay for lodging POIs — slides in from the right.
 * Sticky sub-nav (Apple-blur), hero image, content sections, sticky Book Now footer.
 */
export function ResortOverlay({ poi, onClose, onOpenTour, onBook }: Props) {
  const isOpen = !!poi;
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("overview");

  useEffect(() => {
    if (poi) setSection("overview");
  }, [poi?.id]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[199] bg-[var(--navy-deep)]/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!isOpen}
        className={`apple-glass fixed right-0 top-0 z-[200] flex h-[100svh] w-full flex-col overflow-hidden rounded-none transition-transform duration-500 ease-out md:right-4 md:top-4 md:bottom-4 md:h-auto md:w-[440px] md:rounded-[2rem] ${
          isOpen ? "translate-x-0" : "translate-x-[110%]"
        }`}
        style={{ color: "var(--cream-foreground)" }}
      >
        {poi && (
          <>
            {/* Hero */}
            <div className="relative h-64 w-full shrink-0 overflow-hidden">
              <img
                src={poi.image}
                alt={poi.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/80 via-transparent to-[var(--navy-deep)]/30" />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-[var(--navy-deep)] backdrop-blur-md transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--navy-deep)]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--lemon)]">
                <BedDouble className="h-3 w-3" /> Lodging
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h2 className="font-serif text-3xl leading-tight drop-shadow-md">
                  {poi.name}
                </h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs opacity-90">
                  <MapPin className="h-3.5 w-3.5" /> {poi.location}
                </p>
              </div>
            </div>

            {/* Sticky sub-nav */}
            <nav
              className="sticky top-0 z-10 flex shrink-0 gap-1 border-b px-3 py-2 backdrop-blur-xl"
              style={{
                borderColor: "var(--cream-border)",
                background: "color-mix(in oklab, white 65%, transparent)",
              }}
            >
              {SECTIONS.map((s) => {
                const active = section === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                      active
                        ? "bg-[var(--navy-deep)] text-[var(--lemon)]"
                        : "text-[var(--cream-foreground-muted)] hover:bg-white/50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </nav>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {section === "overview" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-[var(--lemon)] text-[var(--lemon)]" />
                      4.9 · 312 reviews
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{poi.description}</p>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { Icon: Wifi, label: "Wi-Fi" },
                      { Icon: Coffee, label: "Breakfast" },
                      { Icon: BedDouble, label: "Suites" },
                    ].map(({ Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center"
                        style={{ borderColor: "var(--cream-border)", background: "white" }}
                      >
                        <Icon className="h-4 w-4 text-[var(--navy)]" />
                        <span className="text-[10px] uppercase tracking-wider text-[var(--cream-foreground-muted)]">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={onOpenTour}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gradient-lemon)] px-5 py-3.5 text-sm font-semibold text-[var(--navy-deep)] shadow-[var(--shadow-glow)] transition hover:brightness-110"
                  >
                    <Compass className="h-4 w-4 transition group-hover:rotate-45" />
                    View 360° Tour
                  </button>
                </div>
              )}

              {section === "rooms" && (
                <ul className="space-y-3">
                  {["Sea-View Suite", "Garden Villa", "Heritage Loft"].map((r, i) => (
                    <li
                      key={r}
                      className="flex items-center justify-between rounded-xl border bg-white px-4 py-3"
                      style={{ borderColor: "var(--cream-border)" }}
                    >
                      <div>
                        <p className="text-sm font-semibold">{r}</p>
                        <p className="text-[11px] text-[var(--cream-foreground-muted)]">
                          From €{180 + i * 60} / night
                        </p>
                      </div>
                      <BedDouble className="h-5 w-5 text-[var(--navy)]" />
                    </li>
                  ))}
                </ul>
              )}

              {section === "location" && (
                <div className="space-y-3 text-sm">
                  <p className="leading-relaxed">{poi.location}</p>
                  <p className="text-xs text-[var(--cream-foreground-muted)]">
                    Coordinates: {poi.coords[0].toFixed(4)}, {poi.coords[1].toFixed(4)}
                  </p>
                  <div
                    className="aspect-video rounded-xl border bg-[var(--navy-deep)]/10"
                    style={{ borderColor: "var(--cream-border)" }}
                  />
                </div>
              )}
            </div>

            {/* Sticky book footer */}
            <footer
              className="shrink-0 border-t px-5 py-4 backdrop-blur-xl"
              style={{
                borderColor: "var(--cream-border)",
                background: "color-mix(in oklab, white 75%, transparent)",
              }}
            >
              <button
                onClick={onBook}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--navy-deep)] px-5 py-3.5 text-sm font-semibold text-[var(--lemon)] transition hover:brightness-125"
              >
                <CalendarCheck className="h-4 w-4" />
                Book Now
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
