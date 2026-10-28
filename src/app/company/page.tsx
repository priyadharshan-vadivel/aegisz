import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Todo } from "@/components/ui/Todo";
import { Bento, span } from "@/components/ui/Bento";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { ClosingCta, Partners } from "@/components/sections/home";
import { company } from "@/content/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Company",
  description:
    "AegisZ is an Indian cybersecurity product company headquartered in Coimbatore, designing, building and owning AI-driven security platforms for enterprise and government.",
  path: "/company",
});

// Mission tiles: 2 wide + 3 narrow.
const missionSpans = [span.half, span.half, span.third, span.third, span.third];

export default function CompanyPage() {
  return (
    <>
      <Section labelledBy="co-title" className="pt-14 sm:pt-20">
        <SectionHeading id="co-title" as="h1" eyebrow="Company" title="From India, for the world" />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="space-y-6 text-lead text-fg-muted">
            {company.overview.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <dl className="grid content-start divide-y divide-border border-y border-border">
            {company.facts.map((f) => (
              <div key={f.label} className="py-5">
                <dt className="label">{f.label}</dt>
                <dd className="mt-2 text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <section aria-labelledby="vision-title" className="flex min-h-[70vh] items-center border-y border-border bg-surface py-section">
        <div className="mx-auto w-full max-w-site px-gutter">
          <p className="label mb-8">Vision</p>
          <WordReveal id="vision-title" as="h2" text={company.vision} className="max-w-5xl text-statement" />
        </div>
      </section>

      <Section labelledBy="mission-title">
        <h2 id="mission-title" className="label">
          Mission
        </h2>
        <Bento as="ol" className="mt-8">
          {company.mission.map((m, i) => (
            <Reveal as="li" key={m.title} delay={(i % 3) * 0.06} className={missionSpans[i]}>
              <Card className="flex h-full min-h-56 flex-col justify-between gap-10">
                <p className="font-mono text-sm text-fg-subtle">{i + 1}</p>
                <div>
                  <h3 className="text-h3 text-fg">{m.title}</h3>
                  <p className="mt-3 text-fg-muted">{m.body}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </Bento>
      </Section>

      <Section labelledBy="lead-title" tone="surface">
        <SectionHeading
          id="lead-title"
          eyebrow="Leadership"
          title="Founder-led"
          body={<p>Combining security research, product engineering and go-to-market execution.</p>}
        />
        <ul className="mt-16 grid gap-3 sm:gap-4 md:grid-cols-2">
          {company.leadership.map((l, i) => (
            <Reveal as="li" key={l.name} delay={i * 0.08}>
              <Card className="flex h-full min-h-64 flex-col justify-between gap-10 bg-bg">
                <p className="label">{l.role}</p>
                <div>
                  <h3 className="text-h2 text-fg">{l.name}</h3>
                  <p className="mt-4 max-w-md text-fg-muted">{l.focus}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>
        <Todo className="mt-6">Leadership photos and LinkedIn links, if wanted.</Todo>
      </Section>

      <Partners headingId="co-partners-title" />

      <ClosingCta />
    </>
  );
}
