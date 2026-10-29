import { cn } from "@/lib/cn";

/**
 * Infinite chip row. Screen readers get one real list, read once. Every animated copy is
 * aria-hidden. Pauses on hover. Under reduced motion the animation is hidden and the real
 * list is shown as a static wrap of chips.
 */
export function Marquee({ items, label, className }: { items: string[]; label: string; className?: string }) {
  const chip = "shrink-0 rounded-pill border border-border-strong px-5 py-2.5 font-mono text-sm text-fg";
  const copy = (key: string) => (
    <ul key={key} className="flex gap-3 pr-3">
      {items.map((i) => (
        <li key={i} className={chip}>
          {i}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("marquee-wrap", className)}>
      {/* The one accessible list: visually hidden while animating, a static wrap under reduced motion. */}
      <ul aria-label={label} className="sr-only motion-reduce:not-sr-only motion-reduce:flex motion-reduce:flex-wrap motion-reduce:gap-3">
        {items.map((i) => (
          <li key={i} className={chip}>
            {i}
          </li>
        ))}
      </ul>
      {/* Decorative loop. Four copies so each half is wider than any viewport; -50% loops seamlessly. */}
      <div
        aria-hidden
        className="overflow-hidden rounded-pill [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] motion-reduce:hidden"
      >
        <div className="marquee flex w-max">{["a", "b", "c", "d"].map(copy)}</div>
      </div>
    </div>
  );
}
