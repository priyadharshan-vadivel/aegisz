import { cn } from "@/lib/cn";
import type { Verdict } from "@/content/iaac";

export type ProductStatus = "available" | "in-development" | "roadmap";

const statusLabel: Record<ProductStatus, string> = {
  available: "Available",
  "in-development": "In development",
  roadmap: "Roadmap",
};

export function StatusBadge({ status, className }: { status: ProductStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-border-strong px-2.5 py-1 font-mono text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-fg",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", status === "available" ? "bg-accent" : "bg-fg-subtle")}
      />
      {statusLabel[status]}
    </span>
  );
}

/**
 * Monochrome verdict chip; the word carries the meaning. `live` marks the verdict that
 * just arrived, which gets the accent.
 */
export function VerdictBadge({ verdict, live, className }: { verdict: Verdict; live?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-px font-mono text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-[var(--ae-dur-slow)]",
        live ? "border-accent bg-accent text-accent-fg" : "border-border-strong text-fg",
        className,
      )}
    >
      {verdict}
    </span>
  );
}
