import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Flag, Server, ShieldCheck, Users } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { StatusBadge, VerdictBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { Terminal } from "@/components/sections/Terminal";
import { home } from "@/content/home";
import { iaac } from "@/content/iaac";
import { designServices } from "@/content/services";
import { industries } from "@/content/industries";
import { partners } from "@/content/company";
import { demoCta } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-border">
      <Container className="py-section">
        <div className="max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">{home.hero.eyebrow}</p>
          <h1 id="hero-title" className="text-4xl font-semibold text-fg sm:text-5xl lg:text-6xl">
            {home.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-fg-muted sm:text-xl">{home.hero.body}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={demoCta.href}>Book an IAAC demo</LinkButton>
            <LinkButton href="/products" variant="secondary">
              Explore products <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ProblemSection() {
  const p = home.problem;
  return (
    <Section labelledBy="problem-title">
      <SectionHeading id="problem-title" eyebrow={p.eyebrow} title={p.title} body={<p>{p.body}</p>} />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {p.points.map((pt, i) => (
          <Reveal key={pt.title} delay={i * 0.06}>
            <Card className="h-full">
              <h3 className="font-medium text-fg">{pt.title}</h3>
              <p className="mt-2 text-fg-muted">{pt.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <p className="mt-10 max-w-3xl text-lg text-fg">{p.closer}</p>
    </Section>
  );
}

export function PortfolioGrid({ headingAs = "h2" }: { headingAs?: "h2" | "h1" }) {
  const p = home.portfolio;
  return (
    <Section labelledBy="portfolio-title" tone="surface">
      <SectionHeading id="portfolio-title" as={headingAs} eyebrow={p.eyebrow} title={p.title} body={<p>{p.body}</p>} />
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card as="article" className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-fg">
              {iaac.name} <span className="font-normal text-fg-muted">— {iaac.fullName}</span>
            </h3>
            <StatusBadge status={iaac.status} />
          </div>
          <p className="mt-3 text-fg-muted">{iaac.oneLiner}</p>
          <Link
            href={iaac.href}
            className="mt-6 inline-flex items-center gap-1.5 self-start rounded-sm text-sm font-medium text-accent hover:underline"
          >
            Explore IAAC <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Card>
        <div className="rounded-lg border border-border p-6">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">Platform coverage</p>
          <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {p.layers.map((layer) => (
              <li
                key={layer}
                className={
                  layer === "Runtime"
                    ? "rounded-md border border-accent/50 bg-accent/10 px-3 py-2 text-sm text-fg"
                    : "rounded-md border border-border px-3 py-2 text-sm text-fg-muted"
                }
              >
                {layer}
                {layer === "Runtime" && <span className="sr-only"> (IAAC, available now)</span>}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-fg-muted">{p.shared}</p>
        </div>
      </div>
    </Section>
  );
}

export function IaacSpotlight() {
  return (
    <Section labelledBy="iaac-title">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="iaac-title"
            eyebrow="Available now · IAAC"
            title={iaac.headline}
            body={<p>{iaac.summary}</p>}
          />
          <ol className="mt-8 space-y-5">
            {iaac.steps.map((s, i) => (
              <li key={s.key} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border-strong font-mono text-xs text-fg-muted">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium text-fg">{s.title}</h3>
                  <p className="mt-1 text-fg-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <VerdictBadge verdict="allow" /> <VerdictBadge verdict="block" /> <VerdictBadge verdict="review" />
            <span>in under a second, even as root.</span>
          </div>
          <LinkButton href={iaac.href} variant="secondary" className="mt-8">
            How IAAC works <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </div>
        <Terminal className="lg:sticky lg:top-24" />
      </div>
    </Section>
  );
}

export function DesignServicesBand() {
  return (
    <Section labelledBy="services-title" tone="surface">
      <div className="grid gap-10 lg:grid-cols-2">
        <SectionHeading
          id="services-title"
          eyebrow="Security design services"
          title="Security products built to your requirement"
          body={<p>{designServices.summary}</p>}
        />
        <div>
          <ul className="space-y-3">
            {designServices.engagements.map((e) => (
              <li key={e} className="flex gap-3 text-fg-muted">
                <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                <span>{e}</span>
              </li>
            ))}
          </ul>
          <LinkButton href="/design-services" variant="secondary" className="mt-8">
            How an engagement runs <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}

export function WhoWeServe() {
  return (
    <Section labelledBy="serve-title">
      <SectionHeading
        id="serve-title"
        eyebrow="Who we serve"
        title="Where one misused command becomes a board-level event"
        body={
          <p>
            AegisZ serves organisations where a single misused privileged command can become a board-level or
            national-level event.
          </p>
        }
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((ind) => (
          <Card as="li" key={ind.slug} className="flex flex-col">
            <h3 className="font-medium text-fg">{ind.short}</h3>
            <p className="mt-2 flex-1 text-sm text-fg-muted">{ind.why}</p>
          </Card>
        ))}
      </ul>
      <Link
        href="/industries"
        className="mt-8 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-accent hover:underline"
      >
        All industries <ArrowRight className="size-4" aria-hidden />
      </Link>
    </Section>
  );
}

const whyIcons = { shield: ShieldCheck, server: Server, flag: Flag, users: Users };

export function WhyAegisz() {
  const w = home.why;
  return (
    <Section labelledBy="why-title" tone="surface">
      <SectionHeading id="why-title" eyebrow={w.eyebrow} title={w.title} body={<p>{w.body}</p>} />
      <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {w.items.map((item) => {
          const Icon = whyIcons[item.icon as keyof typeof whyIcons];
          return (
            <li key={item.title} className="flex gap-4">
              <Icon className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
              <div>
                <h3 className="font-medium text-fg">{item.title}</h3>
                <p className="mt-1.5 text-fg-muted">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Partners({ headingId = "partners-title" }: { headingId?: string }) {
  return (
    <Section labelledBy={headingId}>
      <SectionHeading
        id={headingId}
        eyebrow="Strategic partnerships"
        title="Our partners"
        body={
          <p>
            Two partners extend AegisZ&apos;s reach: one takes our products to global markets, the other adds offensive
            security expertise.
          </p>
        }
      />
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {partners.map((p) => (
          <Card as="li" key={p.name} className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md bg-logo-tile p-2">
              <Image src={p.logo} alt={`${p.name} logo`} width={112} height={64} className="h-full w-auto object-contain" />
            </div>
            <div>
              <h3 className="font-medium text-fg">
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="rounded-sm hover:underline">
                  {p.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </h3>
              <p className="mt-0.5 text-sm text-accent">
                {p.role} — {p.roleDetail}
              </p>
              <p className="mt-3 text-sm text-fg-muted">{p.about}</p>
            </div>
          </Card>
        ))}
      </ul>
    </Section>
  );
}

export function ClosingCta({
  title = home.closing.title,
  body = home.closing.body,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-border bg-surface">
      <Container className="py-section text-center">
        <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl font-semibold text-fg sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-fg-muted">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href={demoCta.href}>Book an IAAC demo</LinkButton>
          <LinkButton href="/contact" variant="secondary">
            Talk to us
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
