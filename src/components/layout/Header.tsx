"use client";

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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95">
      <Container className="flex h-header items-center justify-between gap-4">
        <Link href="/" className="rounded-sm" aria-label="AegisZ home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors hover:text-fg",
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
