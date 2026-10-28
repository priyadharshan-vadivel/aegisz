"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Wordmark } from "@/components/brand/Logo";
import { demoCta, mainNav } from "@/content/site";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function isActive(pathname: string, href: string) {
  if (href === "/products") return pathname === "/products";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-[var(--ae-dur-base)] ease-out-expo",
        scrolled ? "border-border bg-bg/70 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-header items-center justify-between gap-4">
        <Link href="/" className="flex items-center rounded-sm" aria-label="AegisZ home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-pill px-3 py-1.5 text-[0.8125rem] transition-colors duration-[var(--ae-dur-fast)] hover:text-fg",
                      active ? "text-fg" : "text-fg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <LinkButton href={demoCta.href} size="sm" className="hidden sm:inline-flex">
            {demoCta.label}
          </LinkButton>
          <MobileMenu pathname={pathname} />
        </div>
      </Container>
    </header>
  );
}
