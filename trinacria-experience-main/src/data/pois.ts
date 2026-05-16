import type { LucideIcon } from "lucide-react";
import {
  Mountain,
  Waves,
  TreePalm,
  Camera,
  Sparkles,
  Sunset,
  Compass,
  Castle,
  Flame,
  Anchor,
} from "lucide-react";

export type PoiCategory = "scenic" | "lodging" | "dining";

export interface Spot {
  id: string;
  name: string;
  panorama: string;
  icon: LucideIcon;
}

export interface Poi {
  id: string;
  name: string;
  category: PoiCategory;
  coords: [number, number]; // [lat, lng]
  location: string;
  description: string;
  image: string;
  panorama: string;
  spots: Spot[];
  bookingUrl?: string; // Affiliate / partner link (Phase 2)
  contactEmail?: string; // Direct booking inquiry
}

export interface Island {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  center: [number, number];
  zoom: number;
  hero: string;
  spots: Poi[];
}

/**
 * Panorama assets — Pannellum demo placeholders.
 * To ship real Sicily content, replace these URLs with your own
 * equirectangular JPGs hosted on a CDN, e.g.:
 *   panorama: "https://cdn.trinacria.com/panos/lipari-castle.jpg"
 * Sources: Wikimedia Commons (search "Equirectangular Sicily"),
 * Insta360 captures, or commissioned drone shots.
 */
const PANO = {
  etna: "https://pannellum.org/images/alma.jpg",
  taormina: "https://pannellum.org/images/cerro-toco-0.jpg",
  stromboli: "https://pannellum.org/images/jfk.jpg",
  tree: "https://pannellum.org/images/from-tree.jpg",
  bma: "https://pannellum.org/images/bma-1.jpg",
  toco: "https://pannellum.org/images/tocopilla.jpg",
};

export const ISLANDS: Island[] = [
  {
    id: "sicily",
    slug: "sicily",
    name: "Sicily Mainland",
    tagline: "Crossroads of empires",
    description:
      "From Etna's smoldering crown to baroque Ortigia. The largest island in the Mediterranean.",
    center: [37.6, 14.5],
    zoom: 8,
    hero: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80&q=sicily",
    spots: [
      {
        id: "etna",
        name: "Mount Etna Crater",
        category: "scenic",
        coords: [37.751, 14.9934],
        location: "Catania, Sicily",
        description:
          "Europe's most active volcano. Hike the lunar landscape of the Silvestri Craters and witness lava flows shape the island.",
        image:
          "https://images.unsplash.com/photo-1583244532563-b8b9b6b6b6b6?auto=format&fit=crop&w=1200&q=80&q=etna",
        panorama: PANO.etna,
        spots: [
          { id: "summit", name: "Summit Crater Rim", panorama: PANO.etna, icon: Mountain },
          { id: "silvestri", name: "Silvestri Craters", panorama: PANO.toco, icon: Compass },
          { id: "lava-field", name: "Lava Field Walk", panorama: PANO.tree, icon: Sparkles },
        ],
      },
      {
        id: "taormina-view",
        name: "Teatro Antico di Taormina",
        category: "scenic",
        coords: [37.8523, 15.292],
        location: "Taormina",
        description:
          "Greek-Roman amphitheatre with a sweeping view over Etna and the Ionian Sea — Sicily's most photographed panorama.",
        image:
          "https://images.unsplash.com/photo-1555992336-03a23c7b20ea?auto=format&fit=crop&w=1200&q=80&q=taormina",
        panorama: PANO.taormina,
        spots: [
          { id: "stage", name: "Amphitheatre Stage", panorama: PANO.taormina, icon: Castle },
          { id: "etna-view", name: "Etna Overlook", panorama: PANO.etna, icon: Mountain },
          { id: "isola-bella", name: "Isola Bella Bay", panorama: PANO.bma, icon: Waves },
        ],
      },
      {
        id: "cefalu",
        name: "Cefalù Cathedral & Beach",
        category: "scenic",
        coords: [38.0394, 14.0228],
        location: "Cefalù",
        description:
          "Norman cathedral framed by the Rocca cliff and a crescent of golden sand. Sicily's postcard.",
        image:
          "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80&q=cefalu",
        panorama: PANO.taormina,
        spots: [
          { id: "cathedral", name: "Norman Cathedral", panorama: PANO.taormina, icon: Castle },
          { id: "rocca", name: "La Rocca Summit", panorama: PANO.etna, icon: Mountain },
          { id: "beach", name: "Crescent Beach", panorama: PANO.bma, icon: Waves },
          { id: "lungomare", name: "Lungomare Sunset", panorama: PANO.toco, icon: Sunset },
        ],
      },
      {
        id: "villa-athena",
        name: "Villa Athena",
        category: "lodging",
        coords: [37.2906, 13.5849],
        location: "Valley of the Temples, Agrigento",
        description:
          "5-star boutique hotel facing the Temple of Concordia. Wake up to a 2,500-year-old Doric column outside your window.",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80&q=agrigento",
        panorama: PANO.bma,
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Villa+Athena+Agrigento",
        contactEmail: "reservations@hotelvillaathena.it",
        spots: [
          { id: "suite", name: "Concordia Suite", panorama: PANO.bma, icon: Castle },
          { id: "pool", name: "Infinity Pool", panorama: PANO.tree, icon: Waves },
          { id: "temple", name: "Temple Walk", panorama: PANO.taormina, icon: Camera },
        ],
      },
      {
        id: "don-camillo",
        name: "Ristorante Don Camillo",
        category: "dining",
        coords: [37.0626, 15.2926],
        location: "Ortigia, Syracuse",
        description:
          "Vaulted dining rooms in a 15th-century palazzo. Sicilian seafood elevated with Slow Food principles.",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80&q=ortigia",
        panorama: PANO.toco,
        contactEmail: "info@ristorantedoncamillo.it",
        spots: [
          { id: "hall", name: "Vaulted Hall", panorama: PANO.toco, icon: Castle },
          { id: "courtyard", name: "Inner Courtyard", panorama: PANO.tree, icon: TreePalm },
        ],
      },
      {
        id: "kasbah",
        name: "La Kasbah",
        category: "dining",
        coords: [37.6519, 12.5901],
        location: "Mazara del Vallo",
        description:
          "Tunisian-Sicilian fusion in the historic Arab quarter. Couscous di pesce served under jasmine vines.",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80&q=mazara",
        panorama: PANO.etna,
        contactEmail: "info@lakasbah.it",
        spots: [
          { id: "garden", name: "Jasmine Garden", panorama: PANO.tree, icon: TreePalm },
          { id: "alley", name: "Arab Quarter Alley", panorama: PANO.etna, icon: Compass },
        ],
      },
    ],
  },
  {
    id: "lipari",
    slug: "lipari",
    name: "Lipari",
    tagline: "Heartbeat of the Aeolians",
    description:
      "The largest of the Aeolian Islands. Pumice quarries, Norman walls and aperitivo at sunset.",
    center: [38.4674, 14.954],
    zoom: 13,
    hero: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80&q=lipari",
    spots: [
      {
        id: "lipari-castle",
        name: "Lipari Castle Overlook",
        category: "scenic",
        coords: [38.4674, 14.9572],
        location: "Lipari Citadel",
        description:
          "Fortified acropolis layered with Greek, Roman, Norman and Spanish stone. 360° view of Marina Corta.",
        image:
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80&q=lipari",
        panorama: PANO.taormina,
        spots: [
          { id: "ramparts", name: "Castle Ramparts", panorama: PANO.taormina, icon: Castle },
          { id: "marina", name: "Marina Corta", panorama: PANO.bma, icon: Anchor },
          { id: "pumice", name: "Pumice Cliffs", panorama: PANO.toco, icon: Sparkles },
        ],
      },
      {
        id: "therasia-lipari",
        name: "Hotel Mea",
        category: "lodging",
        coords: [38.4691, 14.9551],
        location: "Lipari",
        description:
          "Cliffside Aeolian hotel with rooftop pool overlooking Vulcano's smoking crater.",
        image:
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80&q=lipari+hotel",
        panorama: PANO.tree,
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel+Mea+Lipari",
        contactEmail: "info@hotelmea.it",
        spots: [
          { id: "rooftop", name: "Rooftop Pool", panorama: PANO.tree, icon: Waves },
          { id: "vulcano-view", name: "Vulcano Vista", panorama: PANO.toco, icon: Sunset },
        ],
      },
      {
        id: "filippino",
        name: "Ristorante Filippino",
        category: "dining",
        coords: [38.4683, 14.9568],
        location: "Piazza Mazzini, Lipari",
        description:
          "Family-run since 1910. Aeolian seafood, capers and Malvasia wine on a piazza terrace.",
        image:
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80&q=lipari+dining",
        panorama: PANO.bma,
        contactEmail: "info@filippino.it",
        spots: [
          { id: "terrace", name: "Piazza Terrace", panorama: PANO.bma, icon: TreePalm },
        ],
      },
    ],
  },
  {
    id: "vulcano",
    slug: "vulcano",
    name: "Vulcano",
    tagline: "The island of fire",
    description:
      "Sulphurous mud baths, black-sand beaches and a still-smoking crater you can summit on foot.",
    center: [38.4111, 14.9669],
    zoom: 14,
    hero: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80&q=vulcano",
    spots: [
      {
        id: "gran-cratere",
        name: "Gran Cratere della Fossa",
        category: "scenic",
        coords: [38.404, 14.9614],
        location: "Vulcano",
        description:
          "One-hour climb to the rim of an active crater hissing yellow fumaroles over the Aeolian arc.",
        image:
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80&q=vulcano",
        panorama: PANO.etna,
        spots: [
          { id: "rim", name: "Crater Rim", panorama: PANO.etna, icon: Flame },
          { id: "fumaroles", name: "Fumaroles", panorama: PANO.toco, icon: Sparkles },
          { id: "aeolian-view", name: "Aeolian Arc View", panorama: PANO.bma, icon: Mountain },
        ],
      },
      {
        id: "sabbie-nere",
        name: "Spiaggia delle Sabbie Nere",
        category: "scenic",
        coords: [38.4198, 14.9611],
        location: "Porto di Ponente, Vulcano",
        description:
          "Volcanic black-sand crescent facing the Faraglioni rocks — Vulcano's most photographed beach.",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80&q=vulcano+beach",
        panorama: PANO.bma,
        spots: [
          { id: "shore", name: "Black Sand Shore", panorama: PANO.bma, icon: Waves },
          { id: "faraglioni", name: "Faraglioni Rocks", panorama: PANO.toco, icon: Anchor },
        ],
      },
      {
        id: "therasia",
        name: "Therasia Resort",
        category: "lodging",
        coords: [38.4109, 14.9419],
        location: "Vulcanello, Aeolian Islands",
        description:
          "Cliff-side luxury resort with infinity pools facing Stromboli at sunset. Whitewashed Aeolian architecture.",
        image:
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80&q=vulcano+resort",
        panorama: PANO.tree,
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Therasia+Resort+Vulcano",
        contactEmail: "reservations@therasiaresort.it",
        spots: [
          { id: "terrace", name: "Cliff Terrace", panorama: PANO.tree, icon: TreePalm },
          { id: "pool", name: "Infinity Pool", panorama: PANO.bma, icon: Waves },
          { id: "sunset", name: "Stromboli Sunset", panorama: PANO.toco, icon: Sunset },
        ],
      },
    ],
  },
  {
    id: "stromboli",
    slug: "stromboli",
    name: "Stromboli",
    tagline: "Lighthouse of the Mediterranean",
    description:
      "A perpetually erupting volcano rising straight out of the sea. Black beaches, white houses, no cars.",
    center: [38.789, 15.213],
    zoom: 13,
    hero: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80&q=stromboli",
    spots: [
      {
        id: "stromboli-crater",
        name: "Stromboli Active Crater",
        category: "scenic",
        coords: [38.789, 15.213],
        location: "Aeolian Islands",
        description:
          "The 'lighthouse of the Mediterranean'. Witness nightly eruptions from this perpetually active volcanic island.",
        image:
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80&q=stromboli",
        panorama: PANO.stromboli,
        spots: [
          { id: "crater", name: "Active Crater", panorama: PANO.stromboli, icon: Flame },
          { id: "sciara", name: "Sciara del Fuoco", panorama: PANO.etna, icon: Mountain },
          { id: "dusk", name: "Sunset Viewpoint", panorama: PANO.toco, icon: Sunset },
        ],
      },
      {
        id: "ginostra",
        name: "Ginostra Hamlet",
        category: "scenic",
        coords: [38.7783, 15.1923],
        location: "Stromboli",
        description:
          "Sicily's most isolated village. Reachable only by boat. 30 residents, donkey transport, oil-lamp restaurants.",
        image:
          "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1200&q=80&q=ginostra",
        panorama: PANO.tree,
        spots: [
          { id: "harbour", name: "Smallest Harbour", panorama: PANO.bma, icon: Anchor },
          { id: "lanes", name: "Whitewashed Lanes", panorama: PANO.tree, icon: Compass },
        ],
      },
      {
        id: "la-sirenetta",
        name: "La Sirenetta Park Hotel",
        category: "lodging",
        coords: [38.7995, 15.2378],
        location: "Stromboli",
        description:
          "Black-sand beachfront hotel facing Strombolicchio rock. Watch eruptions from your private terrace.",
        image:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80&q=stromboli+hotel",
        panorama: PANO.toco,
        bookingUrl: "https://www.booking.com/searchresults.html?ss=La+Sirenetta+Stromboli",
        contactEmail: "info@lasirenetta.it",
        spots: [
          { id: "terrace", name: "Beach Terrace", panorama: PANO.toco, icon: Waves },
        ],
      },
    ],
  },
];

/** Flat list of all POIs (kept for backward compatibility & search). */
export const POIS: Poi[] = ISLANDS.flatMap((i) => i.spots);

export function getIslandBySlug(slug: string): Island | undefined {
  return ISLANDS.find((i) => i.slug === slug);
}
