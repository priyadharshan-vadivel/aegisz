import { Check, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { Todo } from "@/components/ui/Todo";
import { Terminal } from "@/components/sections/Terminal";
import { ArchitectureDiagram, StepFlow } from "@/components/sections/iaac";
import { ClosingCta } from "@/components/sections/home";
import { iaac } from "@/content/iaac";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "IAAC — Intent-Aware Access Control",
  description:
    "IAAC intercepts every command on a Linux server before it runs, judges its intent, and returns Allow, Block or Review in under a second, even when the user is root.",
  path: "/products/iaac",
});

export default function IaacPage() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="iaac-hero" className="border-b border-border">
        <Container className="grid items-center gap-12 py-section lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">
                {iaac.name} · {iaac.fullName}
              </p>
              <StatusBadge status={iaac.status} />
            </div>
            <h1 id="iaac-hero" className="text-4xl font-semibold text-fg sm:text-5xl">
              {iaac.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-fg-muted">{iaac.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/contact?interest=iaac-demo">Book an IAAC demo</LinkButton>
              <LinkButton href="#how-it-works" variant="secondary">
                How it works
              </LinkButton>
            </div>
          </div>
          <Terminal />
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
        <h3 className="mt-14 text-2xl font-semibold text-fg">Permission isn&apos;t intent.</h3>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Each existing control answers a different question. IAAC answers the one they leave open: what is this command
          trying to do?
        </p>
        <Table
          className="mt-8"
          caption="Existing controls and the gap IAAC closes"
          head={["Existing control", "What it does", "The gap IAAC closes"]}
          rows={iaac.gaps.map((g) => [g.control, g.does, g.gap])}
        />
      </Section>

      {/* How it works */}
      <Section id="how-it-works" labelledBy="how-title" tone="surface">
        <SectionHeading id="how-title" eyebrow="How it works" title="See. Judge. Allow, Block or Review." />
        <div className="mt-12">
          <StepFlow />
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
        <div className="mt-12">
          <ArchitectureDiagram />
        </div>
      </Section>

      {/* Capabilities */}
      <Section labelledBy="cap-title" tone="surface">
        <SectionHeading id="cap-title" eyebrow="Key capabilities" title="Built for the most privileged sessions" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {iaac.capabilities.map((c) => (
            <Card as="li" key={c.title}>
              <h3 className="font-medium text-fg">{c.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{c.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Compliance */}
      <Section labelledBy="compliance-title">
        <div className="grid gap-10 lg:grid-cols-2">
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
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {iaac.compliance.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
                <ShieldCheck className="size-4 shrink-0 text-accent" aria-hidden />
                <span className="text-fg">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Deployment */}
      <Section labelledBy="deploy-title" tone="surface">
        <SectionHeading
          id="deploy-title"
          eyebrow="Deployment"
          title="From a single fleet to a sovereign estate"
          body={<p>Observe-first rollout: monitor mode, then enforcement when you&apos;re ready.</p>}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {iaac.deployment.map((d) => (
            <Card as="li" key={d.name} className={cn("flex flex-col", d.highlight && "border-accent/60")}>
              <h3 className="text-lg font-medium text-fg">{d.name}</h3>
              <p className="mt-2 flex-1 text-sm text-fg-muted">{d.body}</p>
              {d.highlight && (
                <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
                  {["Air-gapped", "Self-hosted", "Zero data egress"].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <Check className="size-3.5 text-accent" aria-hidden />
                      {x}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </ul>
        <p className="mt-6 text-sm text-fg-subtle">Pricing is shared on request.</p>
        <Todo className="mt-4">What differs between Basic, Medium and Enterprise (features, limits, support). No prices.</Todo>
      </Section>

      {/* Roadmap */}
      <Section labelledBy="roadmap-title">
        <SectionHeading id="roadmap-title" eyebrow="Roadmap" title="Linux today. Every workload next." />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {iaac.roadmap.map((r, i) => (
            <li key={r.when} className={cn("border-t-2 pt-5", i === 0 ? "border-allow" : "border-border")}>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">{r.when}</p>
              <p className="mt-2 text-fg">{r.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <ClosingCta
        title="See IAAC judge a command in your environment."
        body="Book a demo. We'll start in monitor mode, then move to enforcement when you're ready."
      />
    </>
  );
}
