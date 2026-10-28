import { cn } from "@/lib/cn";

/** Visible placeholder for content we don't have yet. Grep "TODO" in src to list them. */
export function Todo({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-md border border-dashed border-border-strong px-4 py-3 font-mono text-[0.8125rem] text-fg-muted",
        className,
      )}
    >
      <span className="font-semibold text-accent-ink">TODO:</span> {children}
    </div>
  );
}
