import { Heart, Globe, Bookmark, Instagram, Facebook, MessageCircle, ChevronDown, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUIState } from "@/lib/uiState";
import { LANGUAGES, setLang, useLang, useT, type Lang } from "@/lib/lang";

type Platform = { name: string; href: string; Icon: LucideIcon };

const PLATFORMS: Platform[] = [
  { name: "Instagram", href: "https://instagram.com/", Icon: Instagram },
  { name: "Facebook", href: "https://facebook.com/", Icon: Facebook },
  { name: "WhatsApp", href: "https://wa.me/", Icon: MessageCircle },
];

/**
 * Unified Heart-Menu Hub: a single top-right glass button that opens a
 * frosted dropdown containing language selection (EN/IT/FR/DE),
 * a "My Favorites" link, and quick-share platforms. Replaces the
 * previously separate Globe + Heart cluster.
 */
export function SocialShare() {
  const [open, setOpen] = useState(false);
  const { sidebarOpen } = useUIState();
  const lang = useLang();
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pickLang = (l: Lang) => setLang(l);

  return (
    <div
      ref={ref}
      className={`fixed right-6 top-6 z-[100] flex flex-col items-end gap-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        sidebarOpen ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Unified Heart hub trigger — Heart + tiny language indicator */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("menu.aria.close") : t("menu.aria.open")}
        aria-expanded={open}
        className="apple-glass relative grid h-12 w-auto min-w-12 place-items-center rounded-full px-3 transition-transform duration-300 hover:scale-105"
      >
        <span className="flex items-center gap-1.5">
          <Heart
            className={`h-5 w-5 transition-colors ${
              open ? "fill-[var(--lemon)] text-[var(--lemon)]" : "text-[var(--navy-deep)]"
            }`}
            strokeWidth={1.75}
          />
          <span className="flex items-center gap-0.5 text-[10px] font-bold tracking-wide text-[var(--navy-deep)]">
            <Globe className="h-3 w-3" strokeWidth={2} />
            {lang}
          </span>
          <ChevronDown
            className={`h-3 w-3 text-[var(--navy-deep)]/70 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            strokeWidth={2}
          />
        </span>
      </button>

      {/* Glassy dropdown */}
      <div
        className={`w-60 origin-top-right overflow-hidden rounded-2xl border border-white/30 bg-white/20 p-3 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        {/* Language row */}
        <p className="px-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--navy-deep)]/70">
          {t("menu.language")}
        </p>
        <div className="mt-1.5 grid grid-cols-4 gap-1">
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => pickLang(l.code)}
                className={`rounded-full py-1.5 text-[11px] font-bold tracking-wide transition-all ${
                  active
                    ? "bg-[var(--lemon)] text-[var(--navy-deep)] shadow-[0_0_12px_rgba(250,204,21,0.45)]"
                    : "bg-white/40 text-[var(--navy-deep)] hover:bg-white/70"
                }`}
                aria-pressed={active}
              >
                {l.code}
              </button>
            );
          })}
        </div>

        <div className="my-3 h-px bg-white/30" />

        {/* My Favorites */}
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-[12px] font-medium text-[var(--navy-deep)] transition-colors hover:bg-white/40"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/60">
            <Bookmark className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          <span className="flex-1">
            {t("menu.favorites")}
            <span className="block text-[10px] font-normal text-[var(--navy-deep)]/60">
              {t("menu.favorites.sub")}
            </span>
          </span>
        </button>

        <div className="my-3 h-px bg-white/30" />

        {/* Share platforms */}
        <p className="px-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--navy-deep)]/70">
          {t("menu.share")}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              aria-label={p.name}
              className="grid h-9 w-9 flex-1 place-items-center rounded-full bg-white/40 text-[var(--navy-deep)] transition-all hover:bg-[var(--navy-deep)] hover:text-[var(--lemon)]"
            >
              <p.Icon className="h-4 w-4" strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
