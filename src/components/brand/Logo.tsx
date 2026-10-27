import { cn } from "@/lib/cn";

/** AegisZ mark, redrawn from brand/aegisz-logo-icon.png. Inherits currentColor. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-7", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path
        d="M50 22 L13 80 L50 60 L87 80 Z M50 22 V60"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinejoin="miter"
      />
      <circle cx="50" cy="20" r="8" fill="currentColor" />
      <circle cx="50" cy="60" r="7.5" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-fg", className)}>
      <LogoMark />
      <span className="text-lg font-semibold tracking-[0.08em]">AEGISZ</span>
    </span>
  );
}
