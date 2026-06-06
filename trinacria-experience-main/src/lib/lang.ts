import { useSyncExternalStore } from "react";

export type Lang = "EN" | "IT" | "FR" | "DE";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "EN", label: "English" },
  { code: "IT", label: "Italiano" },
  { code: "FR", label: "Français" },
  { code: "DE", label: "Deutsch" },
];

const STORAGE_KEY = "trinacria.lang";

function readInitial(): Lang {
  if (typeof window === "undefined") return "EN";
  const v = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (v && ["EN", "IT", "FR", "DE"].includes(v)) return v;
  return "EN";
}

let current: Lang = readInitial();
const listeners = new Set<() => void>();

function applyHtmlLang(l: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = l.toLowerCase();
}
applyHtmlLang(current);

export function setLang(l: Lang) {
  if (current === l) return;
  current = l;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, l);
  }
  applyHtmlLang(l);
  listeners.forEach((fn) => fn());
}

export function getLang(): Lang {
  return current;
}

export function useLang() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => "EN" as Lang,
  );
}

// ---------- Translation dictionary ----------

type Dict = Record<string, string>;

const TRANSLATIONS: Record<Lang, Dict> = {
  EN: {
    "hero.tagline": "The Digital Twin of Sicily",
    "hero.headline.a": "Wander Sicily ",
    "hero.headline.b": "before you arrive…",
    "hero.subcopy":
      "Step into volcanoes, hidden coves and boutique hideaways through curated 360° tours — then book the room with the view you just stepped into.",
    "cta.explore": "Explore",
    "cta.plan": "Plan My Trip",
    "menu.aria.open": "Open settings & account",
    "menu.aria.close": "Close menu",
    "menu.language": "Language",
    "menu.login": "Log In",
    "menu.login.sub": "Access your account",
    "menu.share": "Share",
    "header.back.islands": "Islands",
    "header.now": "Now Exploring",
    "header.brand": "Trinacria",
    "header.explore.sicily": "Explore Sicily",
    "header.filters.all": "All",
    "cat.scenic": "Scenic Views",
    "cat.lodging": "Lodging",
    "cat.dining": "Dining",
    "side.discover": "Discover",
    "side.tab.explore": "Explore",
    "side.tab.plan": "Plan My Trip",
    "side.back.map": "Back to map",
    "side.tour": "360° Tour",
    "side.sites": "sites",
    "side.experience": "Experience Tags",
    "side.itinerary": "Your Itinerary",
    "side.itinerary.empty":
      "Pick a few tags above to auto-build a route — distances draw on the map.",
    "side.minDrive": "min drive",
  },
  IT: {
    "hero.tagline": "Il Gemello Digitale della Sicilia",
    "hero.headline.a": "Vivi la Sicilia ",
    "hero.headline.b": "prima di arrivare…",
    "hero.subcopy":
      "Entra in vulcani, calette nascoste e rifugi boutique con tour 360° curati — poi prenota la stanza con la vista che hai appena esplorato.",
    "cta.explore": "Esplora",
    "cta.plan": "Pianifica il Viaggio",
    "menu.aria.open": "Apri impostazioni e preferiti",
    "menu.aria.close": "Chiudi menu",
    "menu.language": "Lingua",
    "menu.favorites": "I Miei Preferiti",
    "menu.favorites.sub": "Luoghi e tour salvati",
    "menu.share": "Condividi",
    "header.back.islands": "Isole",
    "header.now": "Stai Esplorando",
    "header.brand": "Trinacria",
    "header.explore.sicily": "Esplora la Sicilia",
    "header.filters.all": "Tutti",
    "cat.scenic": "Panorami",
    "cat.lodging": "Alloggi",
    "cat.dining": "Ristoranti",
    "side.discover": "Scopri",
    "side.tab.explore": "Esplora",
    "side.tab.plan": "Pianifica",
    "side.back.map": "Torna alla mappa",
    "side.tour": "Tour 360°",
    "side.sites": "luoghi",
    "side.experience": "Esperienze",
    "side.itinerary": "Il Tuo Itinerario",
    "side.itinerary.empty":
      "Seleziona alcune esperienze sopra per costruire un itinerario — le distanze appariranno sulla mappa.",
    "side.minDrive": "min in auto",
  },
  FR: {
    "hero.tagline": "Le Jumeau Numérique de la Sicile",
    "hero.headline.a": "Parcourez la Sicile ",
    "hero.headline.b": "avant d'y arriver…",
    "hero.subcopy":
      "Entrez dans les volcans, les criques cachées et les refuges boutique grâce à des visites 360° — puis réservez la chambre avec la vue que vous venez de découvrir.",
    "cta.explore": "Explorer",
    "cta.plan": "Planifier le Voyage",
    "menu.aria.open": "Ouvrir paramètres et favoris",
    "menu.aria.close": "Fermer le menu",
    "menu.language": "Langue",
    "menu.favorites": "Mes Favoris",
    "menu.favorites.sub": "Lieux et visites sauvegardés",
    "menu.share": "Partager",
    "header.back.islands": "Îles",
    "header.now": "Vous Explorez",
    "header.brand": "Trinacria",
    "header.explore.sicily": "Explorer la Sicile",
    "header.filters.all": "Tout",
    "cat.scenic": "Panoramas",
    "cat.lodging": "Hébergement",
    "cat.dining": "Restauration",
    "side.discover": "Découvrir",
    "side.tab.explore": "Explorer",
    "side.tab.plan": "Planifier",
    "side.back.map": "Retour à la carte",
    "side.tour": "Visite 360°",
    "side.sites": "sites",
    "side.experience": "Expériences",
    "side.itinerary": "Votre Itinéraire",
    "side.itinerary.empty":
      "Choisissez quelques expériences ci-dessus pour créer un itinéraire — les distances s'affichent sur la carte.",
    "side.minDrive": "min en voiture",
  },
  DE: {
    "hero.tagline": "Der Digitale Zwilling Siziliens",
    "hero.headline.a": "Entdecke Sizilien ",
    "hero.headline.b": "bevor du ankommst…",
    "hero.subcopy":
      "Tauche durch kuratierte 360°-Touren in Vulkane, versteckte Buchten und Boutique-Refugien ein — und buche dann das Zimmer mit der Aussicht, die du gerade erlebt hast.",
    "cta.explore": "Entdecken",
    "cta.plan": "Reise Planen",
    "menu.aria.open": "Einstellungen & Favoriten öffnen",
    "menu.aria.close": "Menü schließen",
    "menu.language": "Sprache",
    "menu.favorites": "Meine Favoriten",
    "menu.favorites.sub": "Gespeicherte Orte & Touren",
    "menu.share": "Teilen",
    "header.back.islands": "Inseln",
    "header.now": "Du Erkundest",
    "header.brand": "Trinacria",
    "header.explore.sicily": "Sizilien Entdecken",
    "header.filters.all": "Alle",
    "cat.scenic": "Aussichten",
    "cat.lodging": "Unterkünfte",
    "cat.dining": "Restaurants",
    "side.discover": "Entdecken",
    "side.tab.explore": "Entdecken",
    "side.tab.plan": "Reise Planen",
    "side.back.map": "Zurück zur Karte",
    "side.tour": "360°-Tour",
    "side.sites": "Orte",
    "side.experience": "Erlebnisse",
    "side.itinerary": "Deine Route",
    "side.itinerary.empty":
      "Wähle oben einige Erlebnisse, um eine Route zu erstellen — Distanzen erscheinen auf der Karte.",
    "side.minDrive": "Min Fahrt",
  },
};

export type TKey = keyof (typeof TRANSLATIONS)["EN"];

export function t(key: TKey, lang: Lang = current): string {
  return TRANSLATIONS[lang][key] ?? TRANSLATIONS.EN[key] ?? key;
}

/** Hook that returns a translator bound to the current language. */
export function useT() {
  const lang = useLang();
  return (key: TKey) => t(key, lang);
}
