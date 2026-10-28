import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Bento, span } from "@/components/ui/Bento";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { Marquee } from "@/components/motion/Marquee";
import { Terminal } from "@/components/sections/Terminal";
import { BreakItTerminal } from "@/components/sections/BreakItTerminal";
import { DownloadGate } from "@/components/sections/DownloadGate";
import { ArchitectureDiagram, Roadmap, StickyStory } from "@/components/sections/iaac";
import { ClosingCta, CtaPair } from "@/components/sections/home";
import { iaac } from "@/content/iaac";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "IAAC — Intent-Aware Access Control",
  description:
    "IAAC intercepts every command on a Linux server before it runs, judges its intent, and returns Allow, Block or Review in under a second, even when the user is root.",
  path: "/products/iaac",
});

// Capability tiles: sizes vary so the grid reads as a bento, not a table.
// Rows on desktop: 4+2 | 2+2+2 | 3+3 (eight tiles).
const capSpans = [span.twoThirds, span.third, span.third, span.third, span.third, span.third, span.half, span.half];

export default function IaacPage() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="iaac-hero" className="overflow-hidden">
        <Container className="pt-14 pb-section text-center sm:pt-20">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <p className="label">
              {iaac.name} · {iaac.fullName}
            </p>
            <StatusBadge status={iaac.status} />
          </div>
          <h1 id="iaac-hero" className="mx-auto max-w-[14ch] text-h1 text-fg">
            {iaac.headline}
          </h1>
          <p className="mx-auto mt-8 max-w-measure text-lead text-fg-muted">{iaac.summary}</p>
          <div className="mt-10">
            <CtaPair secondary={{ href: "#how-it-works", label: "How it works" }} />
          </div>
          <Reveal y={48} className="mx-auto mt-16 max-w-4xl sm:mt-20">
            <Terminal lit />
          </Reveal>
        </Container>
      </section>

      {/* Problem + permission isn't intent */}
      <Section labelledBy="problem-title">
        <SectionHeading
          id="problem-title"
          eyebrow="The problem"
          title={iaac.problem.heading}
          body={<p>{iaac.problem.body}</p>}
        />
      </Section>

      <section aria-labelledby="intent-title" className="flex min-h-[80vh] items-center py-section">
        <Container>
          <WordReveal id="intent-title" as="h2" text="Permission isn't intent." className="text-display" />
          <p className="mt-10 max-w-measure text-lead text-fg-muted">
            Each existing control answers a different question. IAAC answers the one they leave open: what is this command
            trying to do?
          </p>
        </Container>
      </section>

      <Section labelledBy="gaps-title" className="pt-0">
        <h2 id="gaps-title" className="sr-only">
          Existing controls and the gap IAAC closes
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {iaac.gaps.map((g, i) => (
            <Reveal as="li" key={g.control} delay={(i % 2) * 0.08}>
              <Card className="flex h-full flex-col gap-10">
                <div>
                  <p className="label">Existing control</p>
                  <h3 className="mt-2 text-h2 text-fg">{g.control}</h3>
                  <p className="mt-3 text-fg-muted">
                    <span className="sr-only">What it does: </span>
                    {g.does}
                  </p>
                </div>
                <div className="mt-auto border-t border-border pt-5">
                  <p className="label">The gap IAAC closes</p>
                  <p className="mt-2 text-lead text-accent-ink">{g.gap}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* How it works */}
      <Section id="how-it-works" labelledBy="how-title" tone="surface">
        <SectionHeading id="how-title" eyebrow="How it works" title="See. Judge. Allow, Block or Review." />
        <div className="mt-16 lg:mt-8">
          <StickyStory />
        </div>
      </Section>

      {/* Try to break it */}
      <Section labelledBy="break-title">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeading
            id="break-title"
            eyebrow="Try it"
            title="Try to break it."
            body={<p>Type a command an attacker, or a tired admin, might run. See what IAAC would decide, and why.</p>}
          />
          <BreakItTerminal />
        </div>
      </Section>

      {/* Architecture */}
      <Section labelledBy="arch-title">
        <SectionHeading
          id="arch-title"
          eyebrow="Architecture"
          title="Enforcement on the host, control in your hands"
          body={<p>Decisions happen on the server where the command runs. Analysis never has to leave your environment.</p>}
        />
        <div className="mt-16">
          <ArchitectureDiagram />
        </div>
      </Section>

      {/* Capabilities */}
      <Section labelledBy="cap-title" tone="surface">
        <SectionHeading id="cap-title" eyebrow="Key capabilities" title="Built for the most privileged sessions" />
        <Bento as="ul" className="mt-16">
          {iaac.capabilities.map((c, i) => (
            <Reveal as="li" key={c.title} delay={(i % 3) * 0.06} className={capSpans[i]}>
              <Card className={cn("flex h-full flex-col justify-end bg-bg", i === 0 ? "min-h-56 lg:min-h-72" : "min-h-40 lg:min-h-56")}>
                <h3 className={cn("text-fg", i === 0 ? "text-h2" : "text-h3")}>{c.title}</h3>
                <p className="mt-3 max-w-md text-fg-muted">{c.body}</p>
              </Card>
            </Reveal>
          ))}
        </Bento>
      </Section>

      {/* Compliance */}
      <Section labelledBy="compliance-title">
        <SectionHeading
          id="compliance-title"
          eyebrow="Compliance"
          title="Audit-ready by default"
          body={
            <p>
              Tamper-evident records turn weeks of evidence gathering into a one-click export. IAAC produces compliance
              evidence for:
            </p>
          }
        />
        <Marquee className="mt-12" items={iaac.compliance} label="Compliance frameworks" />
      </Section>

      {/* Deployment */}
      <Section labelledBy="deploy-title" tone="surface">
        <SectionHeading
          id="deploy-title"
          eyebrow="Deployment"
          title="From a single fleet to a sovereign estate"
          body={<p>Observe-first rollout: monitor mode, then enforcement when you&apos;re ready.</p>}
        />
        <Bento as="ul" className="mt-16">
          {iaac.deployment.map((d) => (
            <Reveal as="li" key={d.name} className={d.highlight ? span.full : span.third}>
              {d.highlight ? (
                <div className="glow h-full">
                  <Card className="grid h-full gap-8 border-accent bg-bg md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <p className="label">{d.tagline}</p>
                      <h3 className="mt-3 text-h2 text-fg">{d.name}</h3>
                      <p className="mt-4 max-w-xl text-lead text-fg-muted">{d.body}</p>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {d.features.map((x) => (
                        <li key={x} className="rounded-pill border border-border-strong px-4 py-2 font-mono text-[0.8125rem] text-fg">
                          {x}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ) : (
                <Card className="card-glow flex h-full min-h-64 flex-col justify-between gap-8 bg-bg">
                  <div>
                    <p className="label">{d.tagline}</p>
                    <h3 className="mt-3 text-h2 text-fg">{d.name}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {d.features.map((x) => (
                      <li key={x} className="flex items-center gap-2.5 text-fg-muted">
                        <span aria-hidden className="size-1.5 rounded-full bg-allow" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </Reveal>
          ))}
        </Bento>
        <p className="mt-8 text-fg-subtle">Priced per protected server. Pricing is shared on request.</p>
      </Section>

      {/* Download */}
      <Section id="download" labelledBy="download-title" tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <SectionHeading
            id="download-title"
            eyebrow="Overview"
            title="Download the IAAC overview"
            body={<p>The problem, how IAAC works, architecture, compliance and roadmap, in one PDF.</p>}
          />
          <div className="lg:pt-10">
            <DownloadGate gated={process.env.GATED_DOWNLOAD !== "false"} />
          </div>
        </div>
      </Section>

      {/* Roadmap */}
      <Section labelledBy="roadmap-title">
        <SectionHeading id="roadmap-title" eyebrow="Roadmap" title="Linux today. Every workload next." />
        <Roadmap />
      </Section>

      <ClosingCta
        title="See IAAC judge a command in your environment."
        body="Book a demo. We'll start in monitor mode, then move to enforcement when you're ready."
      />
    </>
  );
}
