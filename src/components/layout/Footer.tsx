import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/brand/Logo";
import { footerNav, legalNav, site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Link href="/" className="inline-block rounded-sm" aria-label="AegisZ home">
              <Wordmark />
            </Link>
            <p className="mt-4 text-sm text-fg-muted">{site.tagline}</p>
            <address className="mt-6 space-y-1 text-sm not-italic text-fg-muted">
              <p>{site.location}</p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-fg">
                  {site.email}
                </a>
              </p>
              <p>
                <a href={site.phoneHref} className="hover:text-fg">
                  {site.phone}
                </a>
              </p>
            </address>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">{group.heading}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-fg-muted hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Built in India. {site.registered}.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href} className="hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
