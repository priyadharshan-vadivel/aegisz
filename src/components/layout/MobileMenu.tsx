"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { demoCta, mainNav } from "@/content/site";
import { cn } from "@/lib/cn";

export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap focus inside the toggle + panel.
      const items = [toggleRef.current!, ...focusables()];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-md text-fg hover:bg-surface-2"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-header bottom-0 z-40 overflow-y-auto border-t border-border bg-bg"
      >
        <nav aria-label="Mobile" className="px-gutter py-6">
          <ul className="flex flex-col">
            {[{ label: "Home", href: "/" }, ...mainNav, { label: "Contact", href: "/contact" }].map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="border-b border-border">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn("block py-4 text-lg", active ? "text-fg" : "text-fg-muted")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <LinkButton href={demoCta.href} className="mt-6 w-full" onClick={() => setOpen(false)}>
            {demoCta.label}
          </LinkButton>
        </nav>
      </div>
    </div>
  );
}
