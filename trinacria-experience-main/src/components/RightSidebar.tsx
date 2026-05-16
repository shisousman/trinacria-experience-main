import { useEffect, useMemo, useState } from "react";
import { distanceKm, estimateDriveMinutes, totalRouteKm } from "@/lib/geo";
import { setPlanTabRequested, useUIState } from "@/lib/uiState";
import {
  ChevronLeft,
  ChevronRight,
  Mountain,
  Hotel,
  UtensilsCrossed,
  Check,
  MapPin,
  ExternalLink,
  Train,
  Ship,
  Plane,
  Lock,
  Sparkles,
  Plus,
  X,
  Route,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Island, Poi, PoiCategory, Spot } from "@/data/pois";
import { useT, type TKey } from "@/lib/lang";

const CATEGORY_META: Record<
  PoiCategory,
  { labelKey: TKey; Icon: LucideIcon; accent: string }
> = {
  scenic: { labelKey: "cat.scenic", Icon: Mountain, accent: "var(--lemon)" },
  lodging: { labelKey: "cat.lodging", Icon: Hotel, accent: "var(--sea)" },
  dining: { labelKey: "cat.dining", Icon: UtensilsCrossed, accent: "oklch(0.65 0.2 30)" },
};

interface Props {
  island: Island;
  tourPoi: Poi | null;
  activeSpotId: string | null;
  onSpotChange: (spotId: string) => void;
  selected: Poi | null;
  onSelectPoi: (poi: Poi) => void;
  visited: Set<string>;
  onToggleVisited: (poiId: string) => void;
  onCloseTour: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itinerary: Poi[];
  onItineraryChange: (next: Poi[]) => void;
}

type TabKey = "explore" | "plan";

const EXPERIENCE_TAGS = [
  { id: "volcano", label: "Volcano Hiking", category: "scenic" as PoiCategory },
  { id: "wine", label: "Wine Tasting", category: "dining" as PoiCategory },
  { id: "history", label: "Ancient History", category: "scenic" as PoiCategory },
  { id: "beach", label: "Beach Relaxation", category: "lodging" as PoiCategory },
  { id: "food", label: "Local Cuisine", category: "dining" as PoiCategory },
  { id: "luxury", label: "Luxury Stays", category: "lodging" as PoiCategory },
];

const LOGISTICS = [
  {
    label: "Train & Bus Tickets",
    sub: "Trenitalia / AST",
    href: "https://www.trenitalia.com",
    Icon: Train,
  },
  {
    label: "Ferry Schedules",
    sub: "Liberty Lines",
    href: "https://www.libertylines.it",
    Icon: Ship,
  },
  {
    label: "Airport Transfers",
    sub: "Catania / Palermo",
    href: "https://www.aeroporto.catania.it",
    Icon: Plane,
  },
];

export function RightSidebar({
  island,
  tourPoi,
  activeSpotId,
  onSpotChange,
  selected,
  onSelectPoi,
  visited,
  onToggleVisited,
  onCloseTour,
  open,
  onOpenChange,
  itinerary,
  onItineraryChange,
}: Props) {
  const collapsed = !open;
  const [tab, setTab] = useState<TabKey>("explore");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const { planTabRequested } = useUIState();
  const t = useT();

  useEffect(() => {
    if (planTabRequested) {
      setTab("plan");
      setPlanTabRequested(false);
    }
  }, [planTabRequested]);

  const grouped = useMemo(() => {
    const map: Record<PoiCategory, Poi[]> = { scenic: [], lodging: [], dining: [] };
    for (const p of island.spots) map[p.category].push(p);
    return map;
  }, [island]);

  const totalCount = island.spots.length;
  const visitedCount = island.spots.filter((p) => visited.has(p.id)).length;

  const suggestedItinerary = useMemo(() => {
    if (selectedTags.size === 0) return [] as Poi[];
    const cats = new Set(
      EXPERIENCE_TAGS.filter((t) => selectedTags.has(t.id)).map((t) => t.category),
    );
    return island.spots.filter((p) => cats.has(p.category)).slice(0, 6);
  }, [selectedTags, island]);

  // Auto-sync the tag-derived suggestion into the lifted itinerary, but only
  // when the user hasn't manually curated their list yet.
  useEffect(() => {
    onItineraryChange(suggestedItinerary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedItinerary]);

  // Reset itinerary when the island changes
  useEffect(() => {
    onItineraryChange([]);
    setSelectedTags(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [island.id]);

  const removeFromItinerary = (id: string) => {
    onItineraryChange(itinerary.filter((p) => p.id !== id));
  };

  const itineraryCoords = itinerary.map((p) => p.coords);
  const totalKm = itineraryCoords.length >= 2 ? totalRouteKm(itineraryCoords) : 0;
  const totalMin = estimateDriveMinutes(totalKm);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <button
        onClick={() => onOpenChange(!open)}
        aria-label={collapsed ? "Open sidebar" : "Collapse sidebar"}
        className={`apple-glass fixed top-1/2 z-[201] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full transition-[right] duration-500 ease-out ${
          collapsed ? "right-4" : "right-[21rem] md:right-[23rem]"
        }`}
        style={{ color: "var(--cream-foreground)" }}
      >
        {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      <aside
        aria-label="Island guide"
        className={`apple-glass fixed right-4 top-4 bottom-4 z-[200] flex w-80 flex-col overflow-hidden rounded-[2rem] pt-20 transition-transform duration-500 ease-out md:w-[22rem] ${
          collapsed ? "translate-x-[110%]" : "translate-x-0"
        }`}
        style={{ color: "var(--cream-foreground)" }}
      >
        <header
          className="border-b px-5 py-5"
          style={{ borderColor: "var(--cream-border)" }}
        >
          {tourPoi ? (
            <div>
              <button
                onClick={onCloseTour}
                className="mb-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--cream-foreground-muted)] hover:text-[var(--cream-foreground)]"
              >
                <ChevronLeft className="h-3 w-3" />
                {t("side.back.map")}
              </button>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--sea)" }}>
                {t("side.tour")}
              </p>
              <h2 className="mt-1 font-serif text-2xl leading-tight">{tourPoi.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--cream-foreground-muted)]">
                <MapPin className="h-3.5 w-3.5" /> {tourPoi.location}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--cream-foreground-muted)]">
                {t("side.discover")}
              </p>
              <h2 className="mt-1 font-serif text-2xl leading-tight">{island.name}</h2>
              <p className="mt-1 text-xs text-[var(--cream-foreground-muted)]">
                {island.tagline}
              </p>

              {/* Tab toggle — pill-within-a-pill */}
              <div
                className="mt-4 flex rounded-full border border-white/30 bg-white/20 p-1 backdrop-blur-md"
                role="tablist"
              >
                {(["explore", "plan"] as TabKey[]).map((key) => {
                  const active = tab === key;
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(key)}
                      className={`flex-1 rounded-full py-2 text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-white text-[var(--navy-deep)] shadow-sm"
                          : "text-[var(--navy-deep)]/60 hover:text-[var(--navy-deep)]"
                      }`}
                    >
                      {key === "explore" ? t("side.tab.explore") : t("side.tab.plan")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        {/* Body */}
        <div className="relative flex-1 overflow-hidden">
          {tourPoi ? (
            <div className="h-full overflow-y-auto px-3 py-2">
              <SpotList
                spots={tourPoi.spots}
                activeSpotId={activeSpotId}
                onSpotChange={onSpotChange}
              />
            </div>
          ) : (
            <>
              {/* Explore tab */}
              <div
                className={`absolute inset-0 overflow-y-auto px-3 py-2 transition-opacity duration-500 ${
                  tab === "explore" ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <Accordion type="multiple" defaultValue={["scenic"]} className="w-full">
                  {(Object.keys(grouped) as PoiCategory[]).map((cat) => {
                    const items = grouped[cat];
                    if (!items.length) return null;
                    const meta = CATEGORY_META[cat];
                    return (
                      <AccordionItem
                        key={cat}
                        value={cat}
                        className="border-b last:border-b-0"
                        style={{ borderColor: "var(--cream-border)" }}
                      >
                        <AccordionTrigger className="px-2 hover:no-underline">
                          <div className="flex w-full items-center gap-3">
                            <span
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                              style={{ background: meta.accent, color: "var(--navy-deep)" }}
                            >
                              <meta.Icon className="h-4 w-4" strokeWidth={2.5} />
                            </span>
                            <span className="flex-1 text-left">
                              <span className="block text-sm font-semibold">{t(meta.labelKey)}</span>
                              <span className="block text-[11px] text-[var(--cream-foreground-muted)]">
                                {items.length} {t("side.sites")}
                              </span>
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-2 pt-0">
                          <ul className="space-y-1 px-2">
                            {items.map((poi) => {
                              const isSelected = selected?.id === poi.id;
                              const isVisited = visited.has(poi.id);
                              return (
                                <li key={poi.id}>
                                  <div
                                    className={`group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors ${
                                      isSelected
                                        ? "bg-[var(--cream-muted)]"
                                        : "hover:bg-[var(--cream-muted)]"
                                    }`}
                                  >
                                    <button
                                      onClick={() => onToggleVisited(poi.id)}
                                      aria-label={isVisited ? "Mark as not visited" : "Mark as visited"}
                                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                                        isVisited
                                          ? "border-transparent bg-[var(--navy)] text-white"
                                          : "border-[var(--cream-border)] bg-white text-transparent hover:border-[var(--navy)]"
                                      }`}
                                    >
                                      <Check className="h-3 w-3" strokeWidth={3} />
                                    </button>
                                    <button
                                      onClick={() => onSelectPoi(poi)}
                                      className="flex-1 text-left"
                                    >
                                      <span
                                        className={`block text-sm leading-tight ${
                                          isVisited
                                            ? "text-[var(--cream-foreground-muted)] line-through"
                                            : ""
                                        }`}
                                      >
                                        {poi.name}
                                      </span>
                                      <span className="block text-[11px] text-[var(--cream-foreground-muted)]">
                                        {poi.location}
                                      </span>
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              {/* Plan tab */}
              <div
                className={`absolute inset-0 overflow-y-auto px-4 py-3 transition-opacity duration-500 ${
                  tab === "plan" ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <section>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--cream-foreground-muted)]">
                    {t("side.experience")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {EXPERIENCE_TAGS.map((tag) => {
                      const active = selectedTags.has(tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-md transition-all ${
                            active
                              ? "border-transparent bg-[var(--navy)] text-white shadow-md"
                              : "border-white/20 bg-white/40 text-[var(--navy-deep)] hover:bg-white/70"
                          }`}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Your Itinerary — distance-aware free tier route */}
                <section className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--cream-foreground-muted)]">
                      {t("side.itinerary")}
                    </p>
                    {itinerary.length >= 2 && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/30 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[var(--navy-deep)] backdrop-blur-md"
                        style={{ boxShadow: "0 4px 14px oklch(0 0 0 / 0.12)" }}
                      >
                        <Route className="h-3 w-3" />
                        {totalKm.toFixed(0)}km · {totalMin} min
                      </span>
                    )}
                  </div>

                  {itinerary.length === 0 ? (
                    <p
                      className="mt-2 rounded-xl border border-dashed px-3 py-4 text-center text-[11px] text-[var(--cream-foreground-muted)]"
                      style={{ borderColor: "var(--cream-border)" }}
                    >
                      {t("side.itinerary.empty")}
                    </p>
                  ) : (
                    <ol className="mt-2 space-y-1.5">
                      {itinerary.map((poi, i) => {
                        const prev = i > 0 ? itinerary[i - 1] : null;
                        const legKm = prev ? distanceKm(prev.coords, poi.coords) : 0;
                        const legMin = prev ? estimateDriveMinutes(legKm) : 0;
                        return (
                          <li key={poi.id}>
                            {prev && (
                              <div className="ml-3 flex items-center gap-2 py-1 text-[10px] font-medium text-[var(--cream-foreground-muted)]">
                                <span className="h-3 w-px bg-[var(--lemon)]" />
                                <span className="rounded-full bg-[var(--lemon)]/30 px-2 py-0.5 text-[var(--navy-deep)]">
                                  {legKm.toFixed(0)}km · {legMin} min drive
                                </span>
                              </div>
                            )}
                            <div
                              className="group flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-2 backdrop-blur-xl transition-colors hover:bg-white"
                              style={{ borderColor: "var(--cream-border)" }}
                            >
                              <span
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold"
                                style={{ background: "var(--lemon)", color: "var(--navy-deep)" }}
                              >
                                {i + 1}
                              </span>
                              <button
                                onClick={() => onSelectPoi(poi)}
                                className="flex-1 text-left"
                              >
                                <span className="block text-sm font-medium leading-tight">
                                  {poi.name}
                                </span>
                                <span className="block text-[11px] text-[var(--cream-foreground-muted)]">
                                  {poi.location}
                                </span>
                              </button>
                              <button
                                onClick={() => removeFromItinerary(poi.id)}
                                aria-label={`Remove ${poi.name} from itinerary`}
                                className="grid h-6 w-6 place-items-center rounded-full text-[var(--cream-foreground-muted)] opacity-0 transition-opacity hover:bg-[var(--cream-muted)] hover:text-[var(--navy-deep)] group-hover:opacity-100"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </section>

                {/* Logistics Hub */}
                <section className="mt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--cream-foreground-muted)]">
                    Logistics Hub
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {LOGISTICS.map(({ label, sub, href, Icon }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-2 backdrop-blur-xl transition-colors hover:bg-white"
                          style={{ borderColor: "var(--cream-border)" }}
                        >
                          <span
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                            style={{ background: "var(--cream-muted)", color: "var(--navy)" }}
                          >
                            <Icon className="h-4 w-4" strokeWidth={2.25} />
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-medium leading-tight">
                              {label}
                            </span>
                            <span className="block text-[11px] text-[var(--cream-foreground-muted)]">
                              {sub}
                            </span>
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-[var(--cream-foreground-muted)]" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Premium AI Guide teaser — frosted lock card */}
                <section className="mt-6 mb-2">
                  <div className="relative overflow-hidden rounded-2xl border border-white/20 p-5 shadow-lg"
                       style={{ background: "linear-gradient(135deg, #001F3F, color-mix(in oklab, #FFD700 40%, transparent))" }}>
                    {/* Frosted Glass Lock Overlay */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 backdrop-blur-[6px]">
                      <div className="flex items-center gap-2 rounded-full border border-white bg-white/95 px-4 py-1.5 shadow-2xl">
                        <Lock size={14} className="text-[#001F3F]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#001F3F]">
                          Premium: Coming Soon
                        </span>
                      </div>
                    </div>

                    {/* Content behind the blur */}
                    <div className="flex items-center gap-2 text-white/90">
                      <Sparkles className="h-4 w-4" style={{ color: "#FFD700" }} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                        Concierge
                      </span>
                    </div>
                    <h4 className="mt-1 font-serif text-xl tracking-tight text-white">
                      AI Digital Guide
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-white/90">
                      Unlock real-time AI audio tours and personalized booking concierges for a seamless Sicilian journey.
                    </p>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>

        {/* Footer tracker — only on Explore + non-tour */}
        {!tourPoi && tab === "explore" && (
          <footer
            className="border-t px-5 py-4"
            style={{ borderColor: "var(--cream-border)" }}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--cream-foreground-muted)]">
                Your journey
              </span>
              <span className="text-xs font-semibold">
                {visitedCount} / {totalCount}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--cream-muted)]">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${totalCount ? (visitedCount / totalCount) * 100 : 0}%`,
                  background: "var(--gradient-lemon)",
                }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[var(--cream-foreground-muted)]">
              {totalCount - visitedCount} to visit
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}

function SpotList({
  spots,
  activeSpotId,
  onSpotChange,
}: {
  spots: Spot[];
  activeSpotId: string | null;
  onSpotChange: (id: string) => void;
}) {
  return (
    <ul className="space-y-1.5 px-2 py-2">
      {spots.map((spot) => {
        const Icon = spot.icon;
        const active = spot.id === activeSpotId;
        return (
          <li key={spot.id}>
            <button
              onClick={() => onSpotChange(spot.id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                active
                  ? "border-[var(--navy)] bg-[var(--navy)] text-white shadow-md"
                  : "border-[var(--cream-border)] bg-white hover:border-[var(--navy)]/40"
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                  active
                    ? "bg-[var(--lemon)] text-[var(--navy-deep)]"
                    : "bg-[var(--cream-muted)] text-[var(--cream-foreground)]"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium leading-tight">{spot.name}</span>
                <span
                  className={`block text-[11px] ${
                    active ? "text-white/70" : "text-[var(--cream-foreground-muted)]"
                  }`}
                >
                  Camera angle
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
