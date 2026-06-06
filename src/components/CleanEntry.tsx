import { useEffect, useRef } from "react";
import logo from "@/assets/trinacria-logo-stacked.png";
import etnaBase from "@/assets/etna-base.jpg";
import etnaReveal from "@/assets/etna-reveal.jpg";
import { HoverMaskReveal } from "./HoverMaskReveal";
import { useT } from "@/lib/lang";

interface Props {
  onExplore: () => void;
  onPlanTrip: () => void;
}

/**
 * Hero stage — anchored by a cursor-driven liquid mask reveal between two
 * Sicilian backdrops, with a 3D revolving brand mark and twin glass CTAs.
 */
export function CleanEntry({ onExplore, onPlanTrip }: Props) {
  const logoRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 2;
      const y = (e.clientY / h - 0.5) * 2;
      el.style.setProperty("--mx", `${(-y * 14).toFixed(2)}deg`);
      el.style.setProperty("--my", `${(x * 18).toFixed(2)}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", `0deg`);
      el.style.setProperty("--my", `0deg`);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Layer 0 — cursor-driven liquid mask reveal */}
      <div className="absolute inset-0 z-0">
        <HoverMaskReveal baseSrc={etnaBase} revealSrc={etnaReveal} radius={200} />
      </div>

      {/* Atmospheric overlay so type stays legible */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--navy-deep)]/55 via-[var(--navy-deep)]/30 to-[var(--navy-deep)]" />

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Tagline */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--lemon)]/85 motion-safe:animate-[fade-in_900ms_ease-out_both]">
          {t("hero.tagline")}
        </p>

        {/* Anchor headline — Instrument Serif */}
        <h1 className="font-instrument mt-5 max-w-3xl text-5xl font-normal leading-[1.05] text-white motion-safe:animate-[fade-in_1100ms_ease-out_both] md:text-6xl lg:text-7xl">
          {t("hero.headline.a")}
          <span className="bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text italic text-transparent">
            {t("hero.headline.b")}
          </span>
        </h1>

        {/* 3D revolving brand mark */}
        <div
          className="relative mt-8 motion-safe:animate-[fade-in_1400ms_ease-out_both]"
          style={{ perspective: "1200px" }}
        >
          <div ref={logoRef} className="hero-logo-3d">
            <img
              src={logo}
              alt="Trinacria Experience"
              className="h-44 w-auto md:h-56 lg:h-64"
              draggable={false}
            />
          </div>
        </div>

        {/* Subcopy */}
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/75 motion-safe:animate-[fade-in_1600ms_ease-out_both] md:text-base">
          {t("hero.subcopy")}
        </p>

        {/* Twin CTAs — glass pills with top-glint hover */}
        <div className="mt-10 flex flex-col items-center gap-3 motion-safe:animate-[fade-in_1800ms_ease-out_both] sm:flex-row sm:gap-4">
          <CTAButton onClick={onExplore} label={t("cta.explore")} />
          <CTAButton onClick={onPlanTrip} label={t("cta.plan")} />
        </div>
      </div>

      <style>{`
        @keyframes hero-logo-float {
          0%   { transform: rotateX(calc(var(--mx, 0deg) + 6deg))  rotateY(calc(var(--my, 0deg) - 14deg)) translateZ(0); }
          25%  { transform: rotateX(calc(var(--mx, 0deg) - 4deg))  rotateY(calc(var(--my, 0deg) + 10deg)) translateZ(8px); }
          50%  { transform: rotateX(calc(var(--mx, 0deg) + 8deg))  rotateY(calc(var(--my, 0deg) + 16deg)) translateZ(0); }
          75%  { transform: rotateX(calc(var(--mx, 0deg) - 6deg))  rotateY(calc(var(--my, 0deg) - 8deg))  translateZ(8px); }
          100% { transform: rotateX(calc(var(--mx, 0deg) + 6deg))  rotateY(calc(var(--my, 0deg) - 14deg)) translateZ(0); }
        }
        .hero-logo-3d {
          --mx: 0deg;
          --my: 0deg;
          transform-style: preserve-3d;
          will-change: transform, filter;
          transition: transform 600ms cubic-bezier(0.4,0,0.2,1);
          filter:
            drop-shadow(0 0 24px oklch(0.88 0.18 95 / 0.45))
            drop-shadow(0 18px 40px rgba(0,0,0,0.45));
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero-logo-3d { animation: hero-logo-float 14s ease-in-out infinite; }
        }
      `}</style>
    </section>
  );
}

function CTAButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/40 bg-white/15 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.04] hover:border-white/60 hover:bg-white/25"
    >
      {/* Top glint — scales to 105% on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 top-0 h-1/2 origin-top rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-70 transition-transform duration-500 group-hover:scale-105"
      />
      <span className="relative">{label}</span>
      <span aria-hidden="true" className="relative inline-block transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}
