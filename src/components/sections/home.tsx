import Image from "next/image";
import { Building2, Factory, Flag, Landmark, Layers, PencilRuler, Server, ShieldCheck, Users } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLink, LinkButton } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Bento, span } from "@/components/ui/Bento";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { WordReveal } from "@/components/motion/WordReveal";
import { HeroVisual } from "@/components/three/HeroVisual";
import { home } from "@/content/home";
import { iaac } from "@/content/iaac";
import { industries } from "@/content/industries";
import { partners } from "@/content/company";
import { demoCta } from "@/content/site";
import { cn } from "@/lib/cn";

type Cta = { href: string; label: string };

export function CtaPair({ primary = { href: demoCta.href, label: "Book an IAAC demo" }, secondary }: { primary?: Cta; secondary: Cta }) {
  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <Magnetic>
        <LinkButton href={primary.href} size="lg" className="w-full sm:w-auto">
          {primary.label}
        </LinkButton>
      </Magnetic>
      <Magnetic>
        <LinkButton href={secondary.href} variant="secondary" size="lg" className="w-full sm:w-auto">
          {secondary.label}
        </LinkButton>
      </Magnetic>
    </div>
  );
}

/* 1. Hero: who AegisZ is */
export function Hero() {
  const [l1, l2, l3] = home.hero.titleLines;
  const words = (s: string, offset: number) =>
    s.split(" ").map((w, i) => (
      <span key={i} aria-hidden className="rise" style={{ animationDelay: `${80 * (offset + i)}ms` }}>
        {w}&nbsp;
      </span>
    ));
  const n1 = l1.split(" ").length;
  const n2 = l2.split(" ").length;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <HeroVisual />
      <Container className="relative pt-16 pb-section sm:pt-24">
        <div className="max-w-5xl">
          <p className="label rise mb-8 block">{home.hero.eyebrow}</p>
          <h1 id="hero-title" aria-label={home.hero.titleLines.join(" ")} className="text-h1 text-fg">
            <span className="block">{words(l1, 0)}</span>
            <span className="block">{words(l2, n1)}</span>
            <span className="block text-fg-muted">{words(l3, n1 + n2)}</span>
          </h1>
          <p className="rise mt-10 block max-w-measure text-lead text-fg-muted" style={{ animationDelay: "600ms" }}>
            {home.hero.body}
          </p>
          <div className="rise mt-12 block" style={{ animationDelay: "720ms" }}>
            <div className="sm:inline-block">
              <CtaPair primary={{ href: "/products", label: "Explore products" }} secondary={{ href: demoCta.href, label: "Book a demo" }} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* 2. Why we exist */
export function WhyWeExist() {
  const p = home.problem;
  return (
    <section aria-labelledby="why-exist-title" className="py-section">
      <Container>
        <p className="label mb-10">{p.eyebrow}</p>
        <h2 id="why-exist-title" className="sr-only">
          {p.lines.join(" ")}
        </h2>
        <div aria-hidden className="space-y-1">
          {p.lines.map((line, i) => (
            <WordReveal key={i} as="p" text={line} className="text-h1" />
          ))}
        </div>
        <p className="mt-14 max-w-measure text-lead text-fg-muted">{p.closer}</p>
      </Container>
    </section>
  );
}

/* 4. What we do */
const whatIcons = { products: Layers, services: PencilRuler };

export function WhatWeDo() {
  const w = home.whatWeDo;
  return (
    <Section labelledBy="what-title">
      <SectionHeading id="what-title" eyebrow={w.eyebrow} title={w.title} />
      <ul className="mt-16 grid gap-3 sm:gap-4 lg:grid-cols-2">
        {w.cards.map((c, i) => {
          const Icon = whatIcons[c.key as keyof typeof whatIcons];
          return (
            <Reveal as="li" key={c.key} delay={i * 0.08}>
              <Card interactive className="card-glow flex h-full min-h-96 flex-col justify-between gap-12 p-8 sm:p-12">
                <Icon aria-hidden strokeWidth={1.25} className="size-10 text-fg" />
                <div>
                  <h3 className="text-h2 text-fg">{c.title}</h3>
                  <p className="mt-5 max-w-md text-lead text-fg-muted">{c.body}</p>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {c.chips.map((chip) => (
                      <li key={chip} className="rounded-pill border border-border-strong px-3.5 py-1.5 font-mono text-[0.75rem] text-fg">
                        {chip}
                      </li>
                    ))}
                  </ul>
                  <ArrowLink href={c.href} className="mt-10">
                    {c.cta}
                  </ArrowLink>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* 5a. Products teaser */
export function PortfolioTeaser() {
  const p = home.portfolio;
  return (
    <Section labelledBy="portfolio-title" tone="surface">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <SectionHeading id="portfolio-title" eyebrow={p.eyebrow} title={p.title} body={<p>{p.body}</p>} />
        <ol aria-label="Platform coverage" className="grid grid-cols-4 gap-2">
          {p.layers.map((layer) => {
            const live = layer === "Runtime";
            return (
              <li
                key={layer}
                className={cn(
                  "rounded-md border px-3 py-4 text-center font-mono text-[0.75rem] sm:text-sm",
                  live ? "border-allow text-fg" : "border-border text-fg-subtle",
                )}
              >
                {layer}
                {live && <span className="sr-only"> (IAAC, available now)</span>}
              </li>
            );
          })}
        </ol>
      </div>
      <Reveal className="mt-14">
        <Card as="article" interactive className="card-glow flex flex-col gap-6 bg-bg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-h2 text-fg">{iaac.name}</h3>
              <StatusBadge status={iaac.status} />
            </div>
            <p className="mt-2 text-fg-muted">
              {iaac.fullName}. {iaac.oneLiner}
            </p>
          </div>
          <ArrowLink href={iaac.href} className="shrink-0">
            Explore IAAC
          </ArrowLink>
        </Card>
      </Reveal>
    </Section>
  );
}

/* 5b. IAAC spotlight */
export function IaacSpotlight({ children }: { children: React.ReactNode }) {
  return (
    <Section labelledBy="iaac-title">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <SectionHeading id="iaac-title" eyebrow="Available now · IAAC" title={iaac.headline} body={<p>{iaac.summary}</p>} />
          <ol className="mt-12 space-y-6">
            {iaac.steps.map((s, i) => (
              <li key={s.key} className="flex gap-5">
                <span className="font-mono text-sm text-fg-subtle">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-fg">{s.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-fg-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <ArrowLink href={iaac.href} className="mt-10">
            How IAAC works
          </ArrowLink>
        </div>
        <Reveal y={40}>{children}</Reveal>
      </div>
    </Section>
  );
}

/* 6. Who we serve: compact icon tiles */
const industryIcons = { landmark: Landmark, bank: Building2, server: Server, factory: Factory };

export function WhoWeServe() {
  return (
    <Section labelledBy="serve-title">
      <SectionHeading id="serve-title" eyebrow="Who we serve" title="Where one misused command becomes a board-level event" />
      <ul className="mt-16 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {industries.map((ind, i) => {
          const Icon = industryIcons[ind.icon];
          return (
            <Reveal as="li" key={ind.slug} delay={i * 0.06}>
              <a
                href={`/industries#${ind.slug}`}
                className="card-glow group flex h-full flex-col gap-8 rounded-tile border border-border bg-surface p-6 transition-[border-color,transform] duration-[var(--ae-dur-base)] ease-out-expo hover:-translate-y-0.5 hover:border-border-strong sm:p-7"
              >
                <Icon aria-hidden strokeWidth={1.5} className="size-7 text-fg transition-colors group-hover:text-accent" />
                <div>
                  <h3 className="text-h3 text-fg">{ind.short}</h3>
                  <p className="mt-2 text-sm text-fg-muted">{ind.chips[0]}</p>
                </div>
              </a>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* 7. Why AegisZ */
const whyIcons = { shield: ShieldCheck, server: Server, flag: Flag, users: Users };

export function WhyAegisz() {
  const w = home.why;
  return (
    <Section labelledBy="why-title" tone="surface">
      <SectionHeading id="why-title" eyebrow={w.eyebrow} title={w.title} body={<p>{w.body}</p>} />
      <Bento as="ul" className="mt-16">
        {w.items.map((item, i) => {
          const Icon = whyIcons[item.icon as keyof typeof whyIcons];
          const wide = i === 0 || i === 3;
          return (
            <Reveal as="li" key={item.title} delay={i * 0.06} className={wide ? span.twoThirds : span.third}>
              <Card className="card-glow flex h-full min-h-64 flex-col justify-between gap-10 bg-bg">
                <Icon className="size-6 text-fg-subtle" aria-hidden strokeWidth={1.5} />
                <div>
                  <h3
                    className={cn(
                      "max-w-[14ch] text-fg",
                      wide ? "text-h2" : "text-[clamp(1.75rem,1rem+1.8vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.03em]",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-fg-muted">{item.body}</p>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </Bento>
    </Section>
  );
}

/* 8. Partners */
export function Partners({ headingId = "partners-title" }: { headingId?: string }) {
  return (
    <Section labelledBy={headingId}>
      <SectionHeading
        id={headingId}
        eyebrow="Strategic partnerships"
        title="Our partners"
        body={<p>One takes our products to global markets; the other adds offensive security expertise.</p>}
      />
      <ul className="mt-16 grid gap-3 sm:gap-4 md:grid-cols-2">
        {partners.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 0.08}>
            <Card interactive className="card-glow flex h-full flex-col gap-8">
              <div className="flex h-16 w-32 items-center justify-center overflow-hidden rounded-md bg-plate p-2.5">
                <Image src={p.logo} alt={`${p.name} logo`} width={128} height={64} className="h-full w-auto object-contain" />
              </div>
              <div>
                <p className="label">{p.role}</p>
                <h3 className="mt-2 text-h3 text-fg">
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="rounded-sm hover:underline underline-offset-4">
                    {p.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </h3>
                <p className="mt-1 text-sm text-fg-muted">{p.roleDetail}</p>
                <p className="mt-4 max-w-[60ch] text-fg-muted">{p.about}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* 9. Closing CTA */
export function ClosingCta({
  title = home.closing.title,
  body = home.closing.body,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="overflow-hidden border-t border-border">
      <Container className="glow py-section text-center">
        <h2 id="cta-title" className="mx-auto max-w-[16ch] text-h1 text-fg">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-measure text-lead text-fg-muted">{body}</p>
        <div className="mt-12">
          <CtaPair secondary={{ href: "/contact", label: "Talk to us" }} />
        </div>
      </Container>
    </section>
  );
}
