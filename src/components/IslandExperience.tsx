import { useEffect, useMemo, useState } from "react";
import { MapView } from "@/components/MapView";
import { TourViewer } from "@/components/TourViewer";
import { BookingModal } from "@/components/BookingModal";
import { IslandPillScroller } from "@/components/IslandSlider";
import { RightSidebar } from "@/components/RightSidebar";
import { PoiPanel } from "@/components/PoiPanel";
import { ResortOverlay } from "@/components/ResortOverlay";
import { SocialHub } from "@/components/SocialHub";
import { ISLANDS, type Island, type Poi, type PoiCategory } from "@/data/pois";
import {
  setSidebarOpen,
  setActiveIslandName,
  setFilterState,
  setBookingOpen,
  setTourActive,
  setPoiSelected,
  useUIState,
} from "@/lib/uiState";

interface Props {
  initialIsland: Island;
  /** When true, lock the experience to one island and hide the slider. */
  lockIsland?: boolean;
}

export function IslandExperience({ initialIsland, lockIsland = false }: Props) {
  const [island, setIsland] = useState<Island>(initialIsland);
  const [selected, setSelected] = useState<Poi | null>(null);
  const [tour, setTour] = useState<Poi | null>(null);
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [booking, setBooking] = useState<Poi | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [activeCategories, setActiveCategories] = useState<Set<PoiCategory>>(new Set());
  const [sidebarOpenState, setSidebarOpenState] = useState(false);
  const [itinerary, setItinerary] = useState<Poi[]>([]);
  const { planTabRequested } = useUIState();

  // If a Plan-tab open was requested (e.g. from the Hero CTA), open the sidebar.
  useEffect(() => {
    if (planTabRequested) setSidebarOpenState(true);
  }, [planTabRequested]);

  // Publish whether a POI is selected so chrome can yield.
  useEffect(() => {
    setPoiSelected(selected !== null);
    return () => setPoiSelected(false);
  }, [selected]);

  // Sync local sidebar state into the global UI store so the OmniHeader can react.
  useEffect(() => {
    setSidebarOpen(sidebarOpenState);
    return () => setSidebarOpen(false);
  }, [sidebarOpenState]);

  // Publish active island name (drives OmniHeader's center text).
  useEffect(() => {
    setActiveIslandName(island.name);
    return () => setActiveIslandName(null);
  }, [island.name]);

  // Publish filter handlers/state so the OmniHeader's filter popover can drive them.
  useEffect(() => {
    setFilterState({
      categories: activeCategories,
      toggleCategory: (cat: PoiCategory) =>
        setActiveCategories((prev) => {
          const next = new Set(prev);
          if (next.has(cat)) next.delete(cat);
          else next.add(cat);
          return next;
        }),
      resetCategories: () => setActiveCategories(new Set()),
    });
  }, [activeCategories]);

  // Reset when caller swaps the locked island (e.g. route change)
  useEffect(() => {
    setIsland(initialIsland);
    setSelected(null);
    setTour(null);
  }, [initialIsland]);

  // Sync first spot when the tour POI changes
  useEffect(() => {
    setActiveSpotId(tour?.spots[0]?.id ?? null);
  }, [tour]);

  // Publish tour & booking flags so chrome (OmniHeader, pill scroller) can hide.
  useEffect(() => {
    setTourActive(tour !== null);
    return () => setTourActive(false);
  }, [tour]);
  useEffect(() => {
    setBookingOpen(booking !== null);
    return () => setBookingOpen(false);
  }, [booking]);

  const visiblePois = useMemo(() => island.spots, [island]);

  const onIslandChange = (next: Island) => {
    setIsland(next);
    setSelected(null);
    setTour(null);
  };

  const handleSelectPoi = (poi: Poi) => {
    setSelected(poi);
  };

  const handleOpenTour = () => {
    if (selected) setTour(selected);
  };

  const toggleVisited = (id: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (cat: PoiCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const tourActive = tour !== null;
  const isLodgingSelected = selected?.category === "lodging";

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Layer 0 — Map (always mounted, fades out when tour is active) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
          tourActive ? "pointer-events-none opacity-0" : "opacity-100"
        } ${sidebarOpenState ? "map-sidebar-open" : ""}`}
      >
        <MapView
          island={island}
          pois={visiblePois}
          selected={selected}
          onSelect={handleSelectPoi}
          activeCategories={activeCategories}
          itinerary={itinerary}
        />
      </div>

      {/* Layer 0 — 360° Tour (fades in over the map) */}
      <div
        className={`absolute inset-0 z-0 bg-[var(--navy-deep)] transition-opacity duration-700 ease-in-out ${
          tourActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <TourViewer
          poi={tour}
          activeSpotId={activeSpotId}
          onSpotChange={setActiveSpotId}
        />
      </div>

      {/* Filters live inside the OmniHeader popover (top center) */}

      {/* Island pill scroller (only when not locked & not in tour) */}
      {!lockIsland && !tourActive && ISLANDS.length > 1 && (
        <IslandPillScroller current={island} onChange={onIslandChange} />
      )}

      {/* Social Hub — bottom-left mock IG feed */}
      {!tourActive && <SocialHub />}

      {/* Persistent Right Sidebar */}
      <RightSidebar
        island={island}
        tourPoi={tour}
        activeSpotId={activeSpotId}
        onSpotChange={setActiveSpotId}
        selected={selected}
        onSelectPoi={handleSelectPoi}
        visited={visited}
        onToggleVisited={toggleVisited}
        onCloseTour={() => setTour(null)}
        open={sidebarOpenState}
        onOpenChange={setSidebarOpenState}
        itinerary={itinerary}
        onItineraryChange={setItinerary}
      />

      {/* Lodging → full-height ResortOverlay; other categories → PoiPanel */}
      {!tourActive && (
        <>
          <ResortOverlay
            poi={isLodgingSelected ? selected : null}
            onClose={() => setSelected(null)}
            onOpenTour={handleOpenTour}
            onBook={() => selected && setBooking(selected)}
          />
          <PoiPanel
            poi={isLodgingSelected ? null : selected}
            onClose={() => setSelected(null)}
            onOpenTour={handleOpenTour}
            onBook={() => selected && setBooking(selected)}
          />
        </>
      )}

      <BookingModal poi={booking} onClose={() => setBooking(null)} />
    </section>
  );
}
