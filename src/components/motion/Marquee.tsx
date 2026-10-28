import { cn } from "@/lib/cn";

/**
 * Infinite chip row. The list is rendered twice for a seamless loop; the copy is aria-hidden.
 * Pauses on hover/focus. Under reduced motion the CSS animation is neutralised and the
 * row wraps as a static set of chips.
 */
export function Marquee({ items, label, className }: { items: string[]; label: string; className?: string }) {
  const chip = "shrink-0 rounded-pill border border-border-strong px-5 py-2.5 font-mono text-sm text-fg";
  return (
    <div className={cn("marquee-wrap", className)}>
      {/* Static version: reduced motion */}
      <ul aria-label={label} className="hidden flex-wrap gap-3 motion-reduce:flex">
        {items.map((i) => (
          <li key={i} className={chip}>
            {i}
          </li>
        ))}
      </ul>
      {/* Animated version */}
      <div
        tabIndex={0}
        role="region"
        aria-label={`${label} (scrolling; hover or focus to pause)`}
        className="overflow-hidden rounded-pill [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] motion-reduce:hidden"
      >
        {/* Two identical halves (each = list twice, so it's wider than any viewport); -50% loops seamlessly. */}
        <div className="marquee flex w-max">
          <div className="flex gap-3 pr-3">
            <ul className="flex gap-3">
              {items.map((i) => (
                <li key={i} className={chip}>
                  {i}
                </li>
              ))}
            </ul>
            <ul aria-hidden className="flex gap-3">
              {items.map((i) => (
                <li key={i} className={chip}>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <ul aria-hidden className="flex gap-3 pr-3">
            {[...items, ...items].map((i, n) => (
              <li key={n} className={chip}>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
