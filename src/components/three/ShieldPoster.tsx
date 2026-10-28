import { cn } from "@/lib/cn";

/*
 * Static stand-in for the 3D scene: same composition (estate, shield, stopped and
 * passing commands, audit ring). Used for SSR, reduced motion, small screens, low-end
 * devices and no-WebGL. Theme-aware through CSS variables.
 */
const nodes = [
  [0, 0], [-34, -22], [30, -30], [-20, 30], [38, 18], [-46, 8], [8, -48], [14, 44], [-8, -14], [22, 4], [-30, -48], [46, -10],
] as const;
const links = [
  [0, 8], [0, 9], [8, 1], [9, 4], [1, 5], [2, 6], [2, 9], [3, 7], [3, 5], [4, 11], [6, 10], [10, 1], [7, 0],
] as const;

export function ShieldPoster({ className }: { className?: string }) {
  return (
    <svg viewBox="-160 -120 320 240" aria-hidden className={cn("h-full w-full", className)} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="sp-shield" r="0.5">
          <stop offset="70%" stopColor="var(--ae-fg)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--ae-fg)" stopOpacity="0.16" />
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="0" rx="112" ry="24" fill="none" stroke="var(--ae-fg-subtle)" strokeWidth="1.2" strokeDasharray="10 4" transform="rotate(-8)" />
      <circle r="92" fill="url(#sp-shield)" stroke="var(--ae-fg)" strokeOpacity="0.18" />
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="var(--ae-fg-subtle)" strokeOpacity="0.5" />
      ))}
      {nodes.map(([x, y], i) => (
        <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill="var(--ae-fg)" />
      ))}
      {/* harmful: stopped at the shield */}
      {[[-128, -40, -86, -28], [118, -66, 78, -46], [96, 92, 62, 66]].map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ae-block)" strokeOpacity="0.6" strokeDasharray="2 4" />
          <circle cx={x2} cy={y2} r="3" fill="var(--ae-block)" />
          <circle cx={x2} cy={y2} r="9" fill="none" stroke="var(--ae-block)" strokeOpacity="0.5" />
        </g>
      ))}
      {/* safe: passes through */}
      {[[-140, 64, -24, 26], [140, 20, 36, 16]].map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ae-allow)" strokeOpacity="0.6" strokeDasharray="2 4" />
          <circle cx={x2} cy={y2} r="2.5" fill="var(--ae-allow)" />
        </g>
      ))}
    </svg>
  );
}
