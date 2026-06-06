import { useEffect, useState } from "react";
import type { Island, Poi, PoiCategory } from "@/data/pois";

interface Props {
  island: Island;
  pois: Poi[];
  selected: Poi | null;
  onSelect: (poi: Poi) => void;
  activeCategories: Set<PoiCategory>;
  itinerary?: Poi[];
}

export function MapView(props: Props) {
  const [Comp, setComp] = useState<React.ComponentType<Props> | null>(null);

  useEffect(() => {
    let active = true;
    import("./MapViewClient").then((m) => {
      if (active) setComp(() => m.MapViewClient);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!Comp) {
    return <div className="h-full w-full animate-pulse bg-[var(--gradient-navy)]" />;
  }
  return <Comp {...props} />;
}
