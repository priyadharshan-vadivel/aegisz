import Image from "next/image";
import { Flag, Server, ShieldCheck, Users } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLink, LinkButton } from "@/components/ui/Button";
import { StatusBadge, VerdictBadge } from "@/components/ui/Badge";
import { Bento, span } from "@/components/ui/Bento";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { WordReveal } from "@/components/motion/WordReveal";
import { Terminal } from "@/components/sections/Terminal";
import { VerdictTriptych } from "@/components/sections/VerdictTriptych";
import { home } from "@/content/home";
import { iaac } from "@/content/iaac";
import { designServices } from "@/content/services";
import { industries } from "@/content/industries";
import { partners } from "@/content/company";
import { demoCta } from "@/content/site";
import { cn } from "@/lib/cn";

/** Headline whose words rise in sequence (CSS, so it paints before JS). */
export function RiseTitle({ text, className, id }: { text: string; className?: string; id?: string }) {
  return (
    <h1 id={id} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="rise" style={{ animationDelay: `${80 * i}ms` }}>
          {w}&nbsp;
        </span>
      ))}
    </h1>
  );
}

export function CtaPair({ secondary }: { secondary: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <Magnetic>
        <LinkButton href={demoCta.href} size="lg" className="w-full sm:w-auto">
          Book an IAAC demo
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

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden">
      <Container className="pt-14 pb-section text-center sm:pt-20">
        <p className="label rise mb-6 block">{home.hero.eyebrow}</p>
        <RiseTitle id="hero-title" text={home.hero.title} className="mx-auto max-w-[12ch] text-display text-fg" />
        <p className="rise mx-auto mt-8 block max-w-measure text-lead text-fg-muted" style={{ animationDelay: "400ms" }}>
          {home.hero.body}
        </p>
        <div className="rise mt-10 block" style={{ animationDelay: "520ms" }}>
          <CtaPair secondary={{ href: "/products", label: "Explore products →" }} />
        </div>
        <Reveal y={48} className="mx-auto mt-16 max-w-4xl sm:mt-20">
          <Terminal lit />
        </Reveal>
      </Container>
    </section>
  );
}

export function ProblemSection() {
  const p = home.problem;
  return (
    <section aria-labelledby="problem-title" className="py-section">
      <Container>
        <p className="label mb-8">{p.eyebrow}</p>
        <WordReveal id="problem-title" text={p.title} className="max-w-[16ch] text-statement" />
        <p className="mt-10 max-w-measure text-lead text-fg-muted">{p.body}</p>
        <div className="mt-20 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
          {p.points.map((pt, i) => (
            <Reveal key={pt.title} delay={i * 0.08}>
              <h3 className="text-h3 text-fg">{pt.title}</h3>
              <p className="mt-2 text-fg-muted">{pt.body}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-20 max-w-3xl text-h3 font-medium text-fg">{p.closer}</p>
      </Container>
    </section>
  );
}

export function PortfolioGrid({ headingAs = "h2" }: { headingAs?: "h2" | "h1" }) {
  const p = home.portfolio;
  return (
    <Section labelledBy="portfolio-title">
      <SectionHeading id="portfolio-title" as={headingAs} eyebrow={p.eyebrow} title={p.title} body={<p>{p.body}</p>} />
      <Bento className="mt-16">
        <Reveal className={cn(span.twoThirds, span.tall)}>
          <Card as="article" interactive className="flex h-full flex-col gap-8 overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-h2 text-fg">{iaac.name}</h3>
                <p className="mt-1 text-fg-muted">{iaac.fullName}</p>
              </div>
              <StatusBadge status={iaac.status} />
            </div>
            <p className="max-w-md text-lead text-fg">{iaac.oneLiner}</p>
            <Terminal still className="mt-auto" />
            <ArrowLink href={iaac.href}>Explore IAAC</ArrowLink>
          </Card>
        </Reveal>
        <Reveal delay={0.08} className={span.third}>
          <Card className="h-full">
            <p className="label">Platform coverage</p>
            <ol className="mt-6 space-y-1">
              {p.layers.map((layer) => (
                <li
                  key={layer}
                  className={cn(
                    "flex items-center justify-between text-h3",
                    layer === "Runtime" ? "text-fg" : "text-fg-subtle",
                  )}
                >
                  {layer}
                  {layer === "Runtime" && (
                    <>
                      <span aria-hidden className="size-2 rounded-full bg-accent" />
                      <span className="sr-only"> (IAAC, available now)</span>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </Card>
        </Reveal>
        <Reveal delay={0.16} className={span.third}>
          <Card className="flex h-full flex-col justify-end">
            <p className="text-lead text-fg">{p.shared}</p>
          </Card>
        </Reveal>
      </Bento>
    </Section>
  );
}

export function IaacSpotlight() {
  return (
    <Section labelledBy="iaac-title" tone="surface">
      <SectionHeading
        id="iaac-title"
        eyebrow="Available now · IAAC"
        title={iaac.headline}
        body={<p>{iaac.summary}</p>}
      />
      <VerdictTriptych className="mt-16" />
      <ol className="mt-16 grid gap-10 md:grid-cols-3">
        {iaac.steps.map((s, i) => (
          <Reveal as="li" key={s.key} delay={i * 0.08}>
            <p className="font-mono text-sm text-fg-subtle">{i + 1}</p>
            <h3 className="mt-2 text-h3 text-fg">{s.title}</h3>
            <p className="mt-2 text-fg-muted">{s.body}</p>
          </Reveal>
        ))}
      </ol>
      <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-fg-muted">
          <VerdictBadge verdict="allow" /> <VerdictBadge verdict="block" /> <VerdictBadge verdict="review" />
          <span>in under a second, even as root.</span>
        </div>
        <LinkButton href={iaac.href} variant="secondary">
          How IAAC works →
        </LinkButton>
      </div>
    </Section>
  );
}

export function DesignServicesBand() {
  return (
    <Section labelledBy="services-title">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <SectionHeading
          id="services-title"
          eyebrow="Security design services"
          title="Security products built to your requirement"
          body={<p>{designServices.summary}</p>}
        />
        <div className="lg:pt-12">
          <ul className="divide-y divide-border border-y border-border">
            {designServices.engagements.map((e, i) => (
              <Reveal as="li" key={e} delay={i * 0.06} className="py-5 text-lead text-fg">
                {e}
              </Reveal>
            ))}
          </ul>
          <ArrowLink href="/design-services" className="mt-8">
            How an engagement runs
          </ArrowLink>
        </div>
      </div>
    </Section>
  );
}

export function WhoWeServe() {
  return (
    <Section labelledBy="serve-title" tone="surface">
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
      <ul className="mt-16 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {industries.map((ind, i) => (
          <Reveal as="li" key={ind.slug} delay={i * 0.06}>
            <Card interactive className="group flex h-full min-h-72 flex-col justify-between bg-bg">
              <span aria-hidden className="h-px w-8 bg-border-strong transition-[width,background-color] duration-[var(--ae-dur-base)] group-hover:w-14 group-hover:bg-accent" />
              <div>
                <h3 className="text-h3 text-fg">{ind.short}</h3>
                <p className="mt-3 text-sm text-fg-muted">{ind.why}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
      <ArrowLink href="/industries" className="mt-10">
        All industries
      </ArrowLink>
    </Section>
  );
}

const whyIcons = { shield: ShieldCheck, server: Server, flag: Flag, users: Users };

export function WhyAegisz() {
  const w = home.why;
  return (
    <Section labelledBy="why-title">
      <SectionHeading id="why-title" eyebrow={w.eyebrow} title={w.title} body={<p>{w.body}</p>} />
      <Bento as="ul" className="mt-16">
        {w.items.map((item, i) => {
          const Icon = whyIcons[item.icon as keyof typeof whyIcons];
          return (
            <Reveal as="li" key={item.title} delay={i * 0.06} className={i === 0 || i === 3 ? span.twoThirds : span.third}>
              <Card className="flex h-full min-h-64 flex-col justify-between gap-10">
                <Icon className="size-6 text-fg-subtle" aria-hidden strokeWidth={1.5} />
                <div>
                  <h3
                    className={cn(
                      "max-w-[14ch] text-fg",
                      i === 0 || i === 3 ? "text-h2" : "text-[clamp(1.75rem,1rem+1.8vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.03em]",
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
      <ul className="mt-16 grid gap-3 sm:gap-4 md:grid-cols-2">
        {partners.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 0.08}>
            <Card interactive className="flex h-full flex-col gap-8">
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
                <p className="mt-4 text-fg-muted">{p.about}</p>
              </div>
            </Card>
          </Reveal>
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
