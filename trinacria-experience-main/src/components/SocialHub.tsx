import { Instagram, Heart } from "lucide-react";
import logo from "@/assets/trinacria-logo.png";

const POSTS = [
  { id: 1, gradient: "linear-gradient(135deg,#1f4068,#0a1f44)", caption: "Stromboli at dusk" },
  { id: 2, gradient: "linear-gradient(135deg,#f6e27a,#cf9f3b)", caption: "Lemon groves" },
  { id: 3, gradient: "linear-gradient(135deg,#3aa6b9,#0a1f44)", caption: "Aeolian blue" },
  { id: 4, gradient: "linear-gradient(135deg,#c8553d,#3a1d12)", caption: "Etna lava" },
];

/**
 * Floating "Social Hub" — bottom-left mock Instagram feed wired to
 * #TrinacriaExperience. Apple-glass frame matches sidebar / filter bar.
 */
export function SocialHub() {
  return (
    <aside
      aria-label="Trinacria social feed"
      className="apple-glass pointer-events-auto fixed bottom-6 left-6 z-[55] hidden w-[260px] flex-col gap-3 rounded-[1.5rem] p-3 lg:flex"
      style={{ color: "var(--cream-foreground)" }}
    >
      <header className="flex items-center gap-2 px-1">
        <img src={logo} alt="" className="h-6 w-auto" draggable={false} />
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--cream-foreground-muted)]">
            Live Feed
          </p>
          <p className="text-xs font-semibold">#TrinacriaExperience</p>
        </div>
        <Instagram className="h-4 w-4 text-[var(--navy)]" />
      </header>

      <div className="grid grid-cols-2 gap-1.5">
        {POSTS.map((p) => (
          <div
            key={p.id}
            className="group relative aspect-square overflow-hidden rounded-lg"
            style={{ background: p.gradient }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            <Heart className="absolute right-1.5 top-1.5 h-3 w-3 text-white/90 opacity-0 transition group-hover:opacity-100" />
            <span className="absolute bottom-1 left-1.5 text-[9px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
              {p.caption}
            </span>
          </div>
        ))}
      </div>

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-full bg-[var(--navy-deep)] px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--lemon)] transition hover:brightness-125"
      >
        Follow for Live 360° Updates
      </a>
    </aside>
  );
}
