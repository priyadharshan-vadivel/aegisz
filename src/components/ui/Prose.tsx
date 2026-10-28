import { cn } from "@/lib/cn";

/** Long-form text styling for policy pages. */
export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "max-w-measure text-lead text-fg-muted",
        "[&_h2]:mt-16 [&_h2]:text-h3 [&_h2]:text-fg",
        "[&_p]:mt-5 [&_ul]:mt-5 [&_ul]:space-y-3 [&_ul]:border-l [&_ul]:border-border-strong [&_ul]:pl-6",
        "[&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-fg [&_code]:font-mono [&_code]:text-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
