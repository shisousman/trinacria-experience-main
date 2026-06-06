import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Mountain, Hotel, UtensilsCrossed } from "lucide-react";
import type { Island, Poi, PoiCategory } from "@/data/pois";
import { distanceKm, estimateDriveMinutes, midpoint, totalRouteKm } from "@/lib/geo";

const ICONS: Record<PoiCategory, React.ReactNode> = {
  scenic: <Mountain size={18} strokeWidth={2.5} />,
  lodging: <Hotel size={18} strokeWidth={2.5} />,
  dining: <UtensilsCrossed size={18} strokeWidth={2.5} />,
};

function buildIcon(cat: PoiCategory, active: boolean, dimmed: boolean) {
  const html = renderToStaticMarkup(
    <div className={`poi-pin ${cat}${active ? " is-active" : ""}${dimmed ? " is-dimmed" : ""}`}>
      {ICONS[cat]}
    </div>
  );
  return L.divIcon({
    html,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function buildDistanceBadge(label: string) {
  const html = `<div class="route-distance-badge">${label}</div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [120, 28],
    iconAnchor: [60, 14],
  });
}

function FlyToIsland({ island }: { island: Island }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    map.flyTo(island.center, island.zoom, { duration: 2.5, easeLinearity: 0.25 });
  }, [island, map]);
  return null;
}

function FlyToPoi({ poi }: { poi: Poi | null }) {
  const map = useMap();
  useEffect(() => {
    if (poi) map.flyTo(poi.coords, Math.max(map.getZoom(), 13), { duration: 1.2 });
  }, [poi, map]);
  return null;
}

interface Props {
  island: Island;
  pois: Poi[];
  selected: Poi | null;
  onSelect: (poi: Poi) => void;
  activeCategories: Set<PoiCategory>;
  itinerary?: Poi[];
}

const ITALY_BOUNDS = L.latLngBounds(L.latLng(35.0, 6.0), L.latLng(47.5, 19.0));

export function MapViewClient({ island, pois, selected, onSelect, activeCategories, itinerary = [] }: Props) {
  const itineraryLine = itinerary.map((p) => p.coords);
  const ambientLine = pois.map((p) => p.coords);
  const hasItinerary = itineraryLine.length >= 2;
  const totalKm = hasItinerary ? totalRouteKm(itineraryLine) : 0;
  const totalMin = hasItinerary ? estimateDriveMinutes(totalKm) : 0;

  return (
    <MapContainer
      center={island.center}
      zoom={island.zoom}
      minZoom={6}
      maxZoom={18}
      maxBounds={ITALY_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      className="h-full w-full"
      worldCopyJump={false}
      zoomControl={false}
    >
      <ZoomControl position="bottomleft" />
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
      <TileLayer
        attribution=""
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
        opacity={0.85}
      />

      {/* Ambient cream dotted thread of all POIs (background) */}
      {!hasItinerary && ambientLine.length >= 2 && (
        <Polyline
          positions={ambientLine}
          pathOptions={{
            color: "#fafaf2",
            weight: 2,
            opacity: 0.6,
            dashArray: "2 8",
            lineCap: "round",
          }}
        />
      )}

      {/* Itinerary route — Lemon dotted polyline + distance badges per leg */}
      {hasItinerary && (
        <>
          <Polyline
            positions={itineraryLine}
            pathOptions={{
              color: "#FFD700",
              weight: 3,
              opacity: 0.95,
              dashArray: "3 10",
              lineCap: "round",
            }}
          />
          {itineraryLine.slice(1).map((pt, i) => {
            const a = itineraryLine[i];
            const b = pt;
            const km = distanceKm(a, b);
            const min = estimateDriveMinutes(km);
            const mid = midpoint(a, b);
            return (
              <Marker
                key={`leg-${i}`}
                position={mid}
                interactive={false}
                icon={buildDistanceBadge(`${km.toFixed(0)}km · ${min} min`)}
              />
            );
          })}
          <Marker
            position={itineraryLine[0]}
            interactive={false}
            icon={buildDistanceBadge(
              `Trip · ${totalKm.toFixed(0)}km · ${totalMin} min`,
            )}
          />
        </>
      )}

      {pois.map((poi) => {
        const dimmed = activeCategories.size > 0 && !activeCategories.has(poi.category);
        return (
          <Marker
            key={poi.id}
            position={poi.coords}
            icon={buildIcon(poi.category, selected?.id === poi.id, dimmed)}
            eventHandlers={{ click: () => onSelect(poi) }}
          />
        );
      })}
      <FlyToIsland island={island} />
      <FlyToPoi poi={selected} />
    </MapContainer>
  );
}
