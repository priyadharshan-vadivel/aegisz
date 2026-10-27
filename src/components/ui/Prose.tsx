import { cn } from "@/lib/cn";

/** Long-form text styling for policy pages. */
export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "max-w-3xl text-fg-muted",
        "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-fg",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_a]:text-fg [&_a]:underline [&_strong]:text-fg [&_code]:font-mono [&_code]:text-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
