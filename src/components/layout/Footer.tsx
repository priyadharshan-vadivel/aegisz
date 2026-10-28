import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/brand/Logo";
import { footerNav, legalNav, site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg text-[0.8125rem]">
      <Container className="pt-16 pb-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-semibold text-fg">{group.heading}</h2>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="font-semibold text-fg">Contact</h2>
            <address className="mt-3 space-y-2 not-italic text-fg-muted">
              <p>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-fg">
                  {site.email}
                </a>
              </p>
              <p>
                <a href={site.phoneHref} className="transition-colors hover:text-fg">
                  {site.phone}
                </a>
              </p>
              <p>{site.location}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="inline-block rounded-sm" aria-label="AegisZ home">
              <Wordmark />
            </Link>
            <p className="mt-3 max-w-sm text-fg-subtle">{site.tagline}</p>
          </div>
          <div className="flex flex-col gap-3 text-fg-subtle md:items-end">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p>
              © {year} {site.name}. Built in India. {site.registered}.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
