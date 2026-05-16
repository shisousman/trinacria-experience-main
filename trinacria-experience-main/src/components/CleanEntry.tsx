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

  const heroVideoSrc = "/landing-loop.mp4";

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Layer 0 — looping hero video background */}
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover"
          poster={etnaBase}
          preload="metadata"
          muted
          autoPlay
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={heroVideoSrc} type="video/mp4" />
          Your browser does not support embedded videos.
        </video>
      </div>

      {/* Layer 1 — fallback cursor-driven liquid mask reveal */}
      <div className="absolute inset-0 -z-10">
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

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10 z-20 relative">
  
          <button
            onClick={onExplore}
            className="group flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans text-[12px] font-bold tracking-widest uppercase transition-all duration-300 ease-out hover:bg-[#FFD60A] hover:text-[#1A2841] hover:border-[#FFD60A] hover:scale-105 shadow-lg"
          >
            <span>Explore Sicily</span>
            <span className="transition-transform group-hover:translate-x-1.5 duration-300">→</span>
          </button>

          <button
            onClick={onPlanTrip}
            className="group flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans text-[12px] font-bold tracking-widest uppercase transition-all duration-300 ease-out hover:bg-[#FFD60A] hover:text-[#1A2841] hover:border-[#FFD60A] hover:scale-105 shadow-lg"
          >
            <span>Plan Your Trip</span>
            <span className="transition-transform group-hover:translate-x-1.5 duration-300">→</span>
          </button>

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
