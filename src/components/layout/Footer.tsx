import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/brand/Logo";
import { companyLinkedIn, footerNav, legalNav, site } from "@/content/site";

const linkCls = "inline-flex min-h-11 items-center text-fg-muted transition-colors hover:text-fg";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-sm" aria-label="AegisZ home">
            <Wordmark />
          </Link>
          <p className="mt-3 text-sm text-fg-subtle">{site.tagline}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-1 text-[0.9375rem] sm:grid-cols-3">
          <ul>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkCls}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul>
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkCls}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="col-span-2 sm:col-span-1">
            <li>
              <a href={`mailto:${site.email}`} className={linkCls}>
                {site.email}
              </a>
            </li>
            {companyLinkedIn && (
              <li>
                <a href={companyLinkedIn} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-border py-6 text-sm text-fg-subtle">
        <p>
          © {year} {site.name}. Built in India.
        </p>
      </Container>
    </footer>
  );
}
