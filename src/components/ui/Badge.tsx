import { cn } from "@/lib/cn";
import type { Verdict } from "@/content/iaac";

export type ProductStatus = "available" | "in-development" | "roadmap";

const statusLabel: Record<ProductStatus, string> = {
  available: "Available",
  "in-development": "In development",
  roadmap: "Roadmap",
};

const statusTone: Record<ProductStatus, string> = {
  available: "text-allow border-allow/40 bg-allow/10",
  "in-development": "text-review border-review/40 bg-review/10",
  roadmap: "text-fg-muted border-border-strong bg-surface-2",
};

export function StatusBadge({ status, className }: { status: ProductStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-xs font-medium",
        statusTone[status],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  );
}

const verdictTone: Record<Verdict, string> = {
  allow: "text-allow border-allow/40 bg-allow/10",
  block: "text-block border-block/40 bg-block/10",
  review: "text-review border-review/40 bg-review/10",
};

export function VerdictBadge({ verdict, className }: { verdict: Verdict; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-px font-mono text-[0.7rem] font-semibold tracking-wider uppercase",
        verdictTone[verdict],
        className,
      )}
    >
      {verdict}
    </span>
  );
}
