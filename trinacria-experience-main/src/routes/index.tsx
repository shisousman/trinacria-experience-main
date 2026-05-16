import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CleanEntry } from "@/components/CleanEntry";
import { IslandCarousel } from "@/components/IslandCarousel";
import { IslandExperience } from "@/components/IslandExperience";
import { ISLANDS, type Island } from "@/data/pois";
import { setFlowStage, setPlanTabRequested, useUIState } from "@/lib/uiState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trinacria Experience — The Digital Twin of Sicily" },
      {
        name: "description",
        content:
          "Explore Sicily and the Aeolian Islands through immersive 360° virtual tours and a map-first booking experience.",
      },
      {
        property: "og:title",
        content: "Trinacria Experience — The Digital Twin of Sicily",
      },
      {
        property: "og:description",
        content:
          "Map-first Sicily: 360° tours of volcanoes, hidden coves, boutique hotels and Sicilian dining — all bookable.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { flowStage } = useUIState();
  const [mapIsland, setMapIsland] = useState<Island>(ISLANDS[0]);

  return (
    <main className="relative min-h-[100svh] bg-[var(--navy-deep)] text-foreground">
      <Stage active={flowStage === "hero"}>
        <CleanEntry
          onExplore={() => setFlowStage("carousel")}
          onPlanTrip={() => {
            setMapIsland(ISLANDS[0]);
            setPlanTabRequested(true);
            setFlowStage("map");
          }}
        />
      </Stage>

      <Stage active={flowStage === "carousel"}>
        <IslandCarousel
          onBackHero={() => setFlowStage("hero")}
          onEnterMap={(island) => {
            setMapIsland(island);
            setFlowStage("map");
          }}
        />
      </Stage>

      <Stage active={flowStage === "map"}>
        <IslandExperience initialIsland={mapIsland} />
      </Stage>
    </main>
  );
}

/**
 * Wrapper that fades-and-scales between full-page flow stages.
 * Inactive stages stay mounted but pointer-events disabled & invisible to
 * preserve transient state (e.g. carousel scroll position) between visits.
 */
function Stage({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      className={`fixed inset-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        active
          ? "z-10 scale-100 opacity-100"
          : "pointer-events-none z-0 scale-[1.02] opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
