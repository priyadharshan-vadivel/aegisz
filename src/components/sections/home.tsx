import Image from "next/image";
import Link from "next/link";
import { Building2, Factory, Landmark, Server } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { LinkedInIcon } from "@/components/brand/LinkedInIcon";
import { home } from "@/content/home";
import { company, partners } from "@/content/company";
import { iaac } from "@/content/iaac";
import { demoCta } from "@/content/site";

type Cta = { href: string; label: string };

export function CtaPair({ primary = { href: demoCta.href, label: "Book an IAAC demo" }, secondary }: { primary?: Cta; secondary: Cta }) {
  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
      <Magnetic className="flex">
        <LinkButton href={primary.href} size="lg" className="w-full sm:w-auto">
          {primary.label}
        </LinkButton>
      </Magnetic>
      <Magnetic className="flex">
        <LinkButton href={secondary.href} variant="secondary" size="lg" className="w-full sm:w-auto">
          {secondary.label}
        </LinkButton>
      </Magnetic>
    </div>
  );
}

/* 1. Hero */
export function Hero({ visual }: { visual: React.ReactNode }) {
  const words = home.hero.title.split(" ");
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[30%] bottom-0 -z-10 sm:inset-y-0 sm:top-0 sm:left-[38%]">
        {visual}
      </div>
      <Container className="flex min-h-[calc(100svh-var(--ae-header-h))] flex-col justify-between gap-10 pt-12 pb-12 sm:justify-center sm:pt-16 sm:pb-20">
        <div className="max-w-5xl">
          <h1 id="hero-title" aria-label={home.hero.title} className="text-display text-fg">
            {words.map((w, i) => (
              <span key={i} aria-hidden className="rise" style={{ animationDelay: `${70 * i}ms` }}>
                {w}&nbsp;
              </span>
            ))}
          </h1>
          <p className="rise mt-8 block max-w-[34ch] text-lead text-fg-muted" style={{ animationDelay: "420ms" }}>
            {home.hero.line}
          </p>
        </div>
        <div className="rise block sm:mt-12" style={{ animationDelay: "520ms" }}>
          <CtaPair primary={{ href: "/products", label: "Explore products" }} secondary={{ href: demoCta.href, label: "Book a demo" }} />
        </div>
      </Container>
    </section>
  );
}

/* 2. About */
export function About() {
  const a = home.about;
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-20">
        <div>
          <p className="label mb-6">{a.eyebrow}</p>
          <h2 id="about-title" className="text-h1 text-fg">
            {a.statement}
          </h2>
          <p className="mt-8 max-w-[52ch] text-lead text-fg-muted">{a.body}</p>
        </div>
        <ul aria-label="Founders" className="grid gap-3">
          {company.leadership.map((l) => (
            <li key={l.name} className="flex items-center gap-4 rounded-tile border border-border bg-surface p-4 sm:p-5">
              <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-border-strong bg-surface-2 font-mono text-fg-muted">
                {l.photo ? <Image src={l.photo} alt="" fill sizes="56px" className="object-cover" /> : <span aria-hidden>{l.initials}</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-fg">{l.name}</p>
                <p className="text-sm text-fg-muted">{l.role}</p>
              </div>
              <a
                href={l.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.name} on LinkedIn (opens in a new tab)`}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-border-strong text-fg-muted transition-colors hover:border-fg-subtle hover:text-fg"
              >
                <LinkedInIcon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* 3. Vision & mission */
export function VisionMission() {
  const v = home.vision;
  return (
    <Section labelledBy="vision-title" tone="surface">
      <p className="label mb-8">{v.eyebrow}</p>
      <h2 id="vision-title" className="max-w-[20ch] text-statement text-fg">
        {company.vision}
      </h2>
      <h3 className="sr-only">Our mission</h3>
      <ul className="mt-14 flex flex-wrap gap-2.5">
        {v.mission.map((m, i) => (
          <Reveal as="li" key={m} delay={i * 0.05}>
            <span className="inline-flex min-h-11 items-center rounded-pill border border-border-strong bg-bg/40 px-5 text-[0.9375rem] text-fg">
              {m}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* 4. Who we serve */
const serveIcons = { landmark: Landmark, bank: Building2, server: Server, factory: Factory };

export function WhoWeServe() {
  const s = home.serve;
  return (
    <Section id="who-we-serve" labelledBy="serve-title">
      <SectionHeading id="serve-title" eyebrow={s.eyebrow} title={s.title} />
      <ul className="mt-14 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {s.tiles.map((t, i) => {
          const Icon = serveIcons[t.icon as keyof typeof serveIcons];
          return (
            <Reveal as="li" key={t.label} delay={i * 0.05}>
              <div className="flex h-full flex-col gap-8 rounded-tile border border-border bg-surface p-6 sm:p-7">
                <Icon aria-hidden strokeWidth={1.5} className="size-7 text-accent-ink" />
                <div>
                  <h3 className="text-h3 text-fg">{t.label}</h3>
                  <p className="mt-2 text-fg-muted">{t.line}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* 5. Our products: IAAC only (shared with /products). Unreleased products are never named. */
export function IaacCard({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Reveal>
      <Link
        href={iaac.href}
        className="card-glow group grid gap-8 rounded-tile border border-border-strong bg-surface p-6 transition-[border-color,transform] duration-[var(--ae-dur-base)] ease-out-expo hover:-translate-y-0.5 hover:border-fg-subtle sm:p-9 md:grid-cols-[1fr_auto] md:items-end"
      >
        <div>
          <StatusBadge status={iaac.status} />
          <H className="mt-8 text-h1 text-fg">{iaac.name}</H>
          <p className="mt-1 text-lead text-fg-muted">{iaac.fullName}</p>
          <p className="mt-6 max-w-[48ch] text-fg-muted">{home.products.line}</p>
        </div>
        <span className="inline-flex min-h-11 items-center gap-1.5 font-medium text-accent-ink">
          Explore {iaac.name}{" "}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </Link>
    </Reveal>
  );
}

export function MoreProductsNote() {
  return <p className="mt-6 text-fg-subtle">{home.products.more}</p>;
}

export function OurProducts() {
  const p = home.products;
  return (
    <Section labelledBy="products-title" tone="surface">
      <SectionHeading id="products-title" eyebrow={p.eyebrow} title={p.title} />
      <div className="mt-14">
        <IaacCard />
        <MoreProductsNote />
      </div>
    </Section>
  );
}

/* 6. Partners + closing CTA */
export function PartnersCta() {
  return (
    <section aria-labelledby="cta-title" className="overflow-hidden border-t border-border">
      <Container className="glow py-section">
        <div className="text-center">
          <h2 id="cta-title" className="mx-auto max-w-[16ch] text-h1 text-fg">
            {home.closing.title}
          </h2>
          <div className="mt-10 flex justify-center">
            <CtaPair secondary={{ href: "/contact", label: "Talk to us" }} />
          </div>
        </div>
        <div className="mt-20">
          <h3 className="label text-center">{home.closing.partnersLabel}</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {partners.map((p) => (
              <li key={p.name}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-5 rounded-tile border border-border bg-surface p-4 transition-colors hover:border-border-strong sm:p-5"
                >
                  <span className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-plate p-2">
                    <Image src={p.logo} alt="" width={96} height={48} className="h-full w-auto object-contain" />
                  </span>
                  <span>
                    <span className="block font-semibold text-fg">
                      {p.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <span className="block text-sm text-fg-muted">{p.role}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* Shared closing CTA for other pages */
export function ClosingCta({ title = home.closing.title, body }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="overflow-hidden border-t border-border">
      <Container className="glow py-section text-center">
        <h2 id="cta-title" className="mx-auto max-w-[16ch] text-h1 text-fg">
          {title}
        </h2>
        {body && <p className="mx-auto mt-6 max-w-measure text-lead text-fg-muted">{body}</p>}
        <div className="mt-10 flex justify-center">
          <CtaPair secondary={{ href: "/contact", label: "Talk to us" }} />
        </div>
      </Container>
    </section>
  );
}
