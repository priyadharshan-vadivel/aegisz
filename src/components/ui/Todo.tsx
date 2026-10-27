import { cn } from "@/lib/cn";

/** Visible placeholder for content we don't have yet. Grep "TODO" in src to list them. */
export function Todo({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-md border border-dashed border-review/60 bg-review/5 px-4 py-3 font-mono text-sm text-review",
        className,
      )}
    >
      <span className="font-semibold">TODO:</span> {children}
    </div>
  );
}
