import { cn } from "@/lib/cn";
import type { Verdict } from "@/content/iaac";

export type ProductStatus = "available" | "in-development" | "roadmap";

const statusLabel: Record<ProductStatus, string> = {
  available: "Available",
  "in-development": "In development",
  roadmap: "Coming",
};

export function StatusBadge({ status, className }: { status: ProductStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-border-strong px-2.5 py-1 font-mono text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-fg",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", status === "available" ? "bg-allow" : "bg-fg-subtle")} />
      {statusLabel[status]}
    </span>
  );
}

const verdictText: Record<Verdict, string> = {
  allow: "text-allow border-allow/50",
  block: "text-block border-block/50",
  review: "text-review border-review/50",
};

const verdictFill: Record<Verdict, string> = {
  allow: "bg-allow border-allow text-bg",
  block: "bg-block border-block text-bg",
  review: "bg-review border-review text-bg",
};

/**
 * Verdict chip. Colour reinforces the word, never replaces it. `live` marks the verdict
 * that just arrived: it fills solid, then settles back to an outline.
 */
export function VerdictBadge({ verdict, live, className }: { verdict: Verdict; live?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-px font-mono text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-[var(--ae-dur-slow)]",
        live ? verdictFill[verdict] : verdictText[verdict],
        className,
      )}
    >
      {verdict}
    </span>
  );
}
