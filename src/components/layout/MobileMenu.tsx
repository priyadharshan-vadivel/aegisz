"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { demoCta, mainNav } from "@/content/site";
import { easeOutExpo, dur } from "@/styles/motion";
import { cn } from "@/lib/cn";

const items = mainNav;

/**
 * The panel is portalled to <body>: the header's backdrop-filter would otherwise become the
 * containing block for this fixed element and clip it.
 */
export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // The panel is portalled to the end of <body>, so DOM order doesn't connect it to the
      // toggle. Cycle explicitly through toggle + panel links.
      e.preventDefault();
      const list = [toggleRef.current!, ...focusables()];
      const at = list.indexOf(document.activeElement as HTMLElement);
      const next = at === -1 ? 1 : (at + (e.shiftKey ? -1 : 1) + list.length) % list.length;
      list[next]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur.fast }}
          className="fixed inset-0 z-[35] overflow-y-auto bg-bg/95 pt-header backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="px-gutter pt-6 pb-10">
            <ul className="flex flex-col">
              {items.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: dur.base, delay: 0.03 * i, ease: easeOutExpo }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block py-2.5 text-[2rem] leading-tight font-semibold tracking-[-0.03em]",
                        active ? "text-fg" : "text-fg-muted",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <LinkButton href={demoCta.href} size="lg" className="mt-10 w-full" onClick={() => setOpen(false)}>
              {demoCta.label}
            </LinkButton>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-pill text-fg hover:bg-surface-2"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>
      {mounted && createPortal(panel, document.body)}
    </div>
  );
}
