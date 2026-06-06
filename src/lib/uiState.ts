import { useSyncExternalStore } from "react";
import type { PoiCategory } from "@/data/pois";

/**
 * Tiny external store for cross-tree UI state shared between the root layout
 * (OmniHeader) and feature trees (IslandExperience).
 */
type State = {
  sidebarOpen: boolean;
  activeIslandName: string | null;
  filterCategories: Set<PoiCategory>;
  toggleCategory: (cat: PoiCategory) => void;
  resetCategories: () => void;
  /** True once the user scrolls past the clean-entry hero (~100px). */
  revealed: boolean;
  /** True while a booking modal is active — strips chrome for focus. */
  bookingOpen: boolean;
  /** True while a 360° tour is mounted — also hides nav chrome. */
  tourActive: boolean;
  /** Top-level flow stage. */
  flowStage: "hero" | "carousel" | "map";
  /** Index of the island currently focused in the carousel. */
  carouselIndex: number;
  /** True when a POI/hotspot is selected — chrome should yield. */
  poiSelected: boolean;
  /** Pending request to open the sidebar's "Plan" tab. */
  planTabRequested: boolean;
};

const noop = () => {};

let state: State = {
  sidebarOpen: false,
  activeIslandName: null,
  filterCategories: new Set(),
  toggleCategory: noop,
  resetCategories: noop,
  revealed: false,
  bookingOpen: false,
  tourActive: false,
  flowStage: "hero",
  carouselIndex: 0,
  poiSelected: false,
  planTabRequested: false,
};
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => state;
const getServerSnapshot = () => state;

export function setSidebarOpen(open: boolean) {
  if (state.sidebarOpen === open) return;
  state = { ...state, sidebarOpen: open };
  emit();
}

export function setActiveIslandName(name: string | null) {
  if (state.activeIslandName === name) return;
  state = { ...state, activeIslandName: name };
  emit();
}

export function setFilterState(args: {
  categories: Set<PoiCategory>;
  toggleCategory: (cat: PoiCategory) => void;
  resetCategories: () => void;
}) {
  state = {
    ...state,
    filterCategories: args.categories,
    toggleCategory: args.toggleCategory,
    resetCategories: args.resetCategories,
  };
  emit();
}

export function setRevealed(v: boolean) {
  if (state.revealed === v) return;
  state = { ...state, revealed: v };
  emit();
}

export function setBookingOpen(v: boolean) {
  if (state.bookingOpen === v) return;
  state = { ...state, bookingOpen: v };
  emit();
}

export function setTourActive(v: boolean) {
  if (state.tourActive === v) return;
  state = { ...state, tourActive: v };
  emit();
}

export function setFlowStage(stage: State["flowStage"]) {
  if (state.flowStage === stage) return;
  state = { ...state, flowStage: stage, revealed: stage === "map" };
  emit();
}

export function setCarouselIndex(i: number) {
  if (state.carouselIndex === i) return;
  state = { ...state, carouselIndex: i };
  emit();
}

export function setPoiSelected(v: boolean) {
  if (state.poiSelected === v) return;
  state = { ...state, poiSelected: v };
  emit();
}

export function setPlanTabRequested(v: boolean) {
  if (state.planTabRequested === v) return;
  state = { ...state, planTabRequested: v };
  emit();
}

export function useUIState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
