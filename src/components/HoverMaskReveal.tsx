import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface Props {
  baseSrc: string;
  revealSrc: string;
  /** Approximate blob radius in px */
  radius?: number;
  className?: string;
}

/**
 * HoverMaskReveal — layers two backgrounds and reveals the top one through
 * a cursor-following organic "liquid blob" mask. The blob shape itself
 * morphs continuously and the SVG turbulence/displacement filter adds
 * extra wobble so the edge always looks like flowing liquid.
 */
export function HoverMaskReveal({
  baseSrc,
  revealSrc,
  radius = 220,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw cursor position
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Liquid lag
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.8 });

  // Drive an SVG mask transform — translate the blob to follow cursor
  const maskTransform = useTransform(
    [sx, sy],
    ([x, y]) => `translate(${x as number} ${y as number})`,
  );

  // Parallax offsets for the base layer
  const baseX = useTransform(sx, (v) => {
    if (typeof window === "undefined") return 0;
    return ((v as number) - window.innerWidth / 2) * -0.025;
  });
  const baseY = useTransform(sy, (v) => {
    if (typeof window === "undefined") return 0;
    return ((v as number) - window.innerHeight / 2) * -0.025;
  });

  useEffect(() => {
    mx.set(window.innerWidth / 2);
    my.set(window.innerHeight / 2);
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // Two organic blob silhouettes — we morph between them with SMIL <animate>
  // for a constantly overflowing, drippy shape. Coordinates are centered at (0,0)
  // so the parent <g transform="translate(x y)"> places the blob under the cursor.
  const r = radius;
  const blobA = `M ${-r * 0.95},${-r * 0.15}
    C ${-r * 1.1},${-r * 0.7}  ${-r * 0.35},${-r * 1.15}  ${r * 0.2},${-r * 0.95}
    C ${r * 0.95},${-r * 0.78}  ${r * 1.18},${-r * 0.1}   ${r * 0.92},${r * 0.45}
    C ${r * 0.7},${r * 1.05}    ${r * 0.05},${r * 1.2}    ${-r * 0.55},${r * 0.95}
    C ${-r * 1.15},${r * 0.65}  ${-r * 0.85},${r * 0.35}  ${-r * 0.95},${-r * 0.15} Z`;
  const blobB = `M ${-r * 1.05},${-r * 0.35}
    C ${-r * 0.85},${-r * 1.0}  ${-r * 0.1},${-r * 1.2}   ${r * 0.45},${-r * 0.85}
    C ${r * 1.15},${-r * 0.5}   ${r * 1.05},${r * 0.2}    ${r * 0.78},${r * 0.7}
    C ${r * 0.4},${r * 1.18}    ${-r * 0.3},${r * 1.0}    ${-r * 0.85},${r * 0.55}
    C ${-r * 1.2},${r * 0.15}   ${-r * 1.2},${-r * 0.05}  ${-r * 1.05},${-r * 0.35} Z`;
  const blobC = `M ${-r * 0.9},${-r * 0.45}
    C ${-r * 0.55},${-r * 1.1}  ${r * 0.25},${-r * 1.05}  ${r * 0.85},${-r * 0.6}
    C ${r * 1.25},${-r * 0.15}  ${r * 0.95},${r * 0.55}   ${r * 0.45},${r * 0.95}
    C ${-r * 0.15},${r * 1.25}  ${-r * 0.95},${r * 0.85}  ${-r * 1.1},${r * 0.2}
    C ${-r * 1.2},${-r * 0.2}   ${-r * 1.05},${-r * 0.25} ${-r * 0.9},${-r * 0.45} Z`;

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* SVG defs — turbulence + displacement = liquid edge wobble + blob mask */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="liquid-edge" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.014"
              numOctaves="2"
              seed="9"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="11s"
                values="0.008 0.014; 0.018 0.009; 0.008 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="42"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <mask id="liquid-blob-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <motion.g style={{ transform: maskTransform }}>
              <path fill="white" filter="url(#liquid-edge)">
                <animate
                  attributeName="d"
                  dur="7s"
                  repeatCount="indefinite"
                  values={`${blobA};${blobB};${blobC};${blobA}`}
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                />
              </path>
            </motion.g>
          </mask>
        </defs>
      </svg>

      {/* Layer 1 — base (subtle parallax counter-drift) */}
      <motion.img
        src={baseSrc}
        alt=""
        style={{ x: baseX, y: baseY }}
        className="absolute inset-0 h-full w-full scale-110 object-cover"
        draggable={false}
      />

      {/* Layer 2 — reveal, masked through the morphing liquid blob */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{ mask: "url(#liquid-blob-mask)", WebkitMask: "url(#liquid-blob-mask)" }}
      >
        <img
          src={revealSrc}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}
