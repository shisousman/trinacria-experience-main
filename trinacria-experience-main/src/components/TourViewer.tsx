import { useEffect, useRef } from "react";
import "pannellum/build/pannellum.css";
import type { Poi, Spot } from "@/data/pois";

// Pannellum ships as a UMD script that attaches to window.pannellum.
// The @types/pannellum package only declares a global namespace, so we
// import the script for its side-effect and read off the window.
declare global {
  interface Window {
    pannellum?: {
      viewer: (el: HTMLElement, cfg: Record<string, unknown>) => {
        destroy: () => void;
      };
    };
  }
}

let pannellumPromise: Promise<Window["pannellum"]> | null = null;
async function loadPannellum() {
  if (typeof window === "undefined") return undefined;
  if (window.pannellum) return window.pannellum;
  if (!pannellumPromise) {
    pannellumPromise = import("pannellum/build/pannellum.js").then(
      () => window.pannellum,
    );
  }
  return pannellumPromise;
}

interface Props {
  poi: Poi | null;
  activeSpotId: string | null;
  onSpotChange: (id: string) => void;
}

export function TourViewer({ poi, activeSpotId, onSpotChange }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const onSpotChangeRef = useRef(onSpotChange);
  useEffect(() => {
    onSpotChangeRef.current = onSpotChange;
  }, [onSpotChange]);

  useEffect(() => {
    if (!poi || !mountRef.current) return;
    const activeSpot: Spot =
      poi.spots.find((s) => s.id === activeSpotId) ?? poi.spots[0];
    if (!activeSpot) return;

    let destroyed = false;
    let viewer: { destroy: () => void } | null = null;
    const el = mountRef.current;

    const others = poi.spots.filter((s) => s.id !== activeSpot.id);
    const hotSpots = others.map((s, idx) => ({
      pitch: -5,
      yaw: -120 + (240 / Math.max(others.length, 1)) * idx,
      type: "info" as const,
      text: s.name,
      cssClass: `trinacria-hotspot trinacria-hotspot--${poi.category}`,
      clickHandlerFunc: () => onSpotChangeRef.current(s.id),
    }));

    loadPannellum().then((p) => {
      if (destroyed || !p) return;
      viewer = p.viewer(el, {
        type: "equirectangular",
        panorama: activeSpot.panorama,
        autoLoad: true,
        autoRotate: -2,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        compass: false,
        hotSpots,
        hotSpotDebug: false,
      });
    });

    return () => {
      destroyed = true;
      try {
        viewer?.destroy();
      } catch {
        /* noop */
      }
    };
  }, [poi, activeSpotId]);

  if (!poi) return null;
  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
}
