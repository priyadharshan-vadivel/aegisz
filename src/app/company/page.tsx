import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Todo } from "@/components/ui/Todo";
import { ClosingCta, Partners } from "@/components/sections/home";
import { company } from "@/content/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Company",
  description:
    "AegisZ is an Indian cybersecurity product company headquartered in Coimbatore, designing, building and owning AI-driven security platforms for enterprise and government.",
  path: "/company",
});

export default function CompanyPage() {
  return (
    <>
      <Section labelledBy="co-title">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading id="co-title" as="h1" eyebrow="Company" title="From India, for the world" />
            <div className="mt-6 space-y-4 text-lg text-fg-muted">
              {company.overview.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <dl className="grid content-start gap-5 rounded-lg border border-border p-6">
            {company.facts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">{f.label}</dt>
                <dd className="mt-1 text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section labelledBy="vision-title" tone="surface">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">Vision</p>
        <h2 id="vision-title" className="mt-3 max-w-4xl text-2xl font-semibold text-fg sm:text-3xl">
          {company.vision}
        </h2>

        <h2 className="mt-16 font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">Mission</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {company.mission.map((m, i) => (
            <Card as="li" key={m.title}>
              <p className="font-mono text-sm text-accent">0{i + 1}</p>
              <h3 className="mt-2 font-medium text-fg">{m.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{m.body}</p>
            </Card>
          ))}
        </ol>
      </Section>

      <Section labelledBy="lead-title">
        <SectionHeading
          id="lead-title"
          eyebrow="Leadership"
          title="Founder-led"
          body={<p>Combining security research, product engineering and go-to-market execution.</p>}
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {company.leadership.map((l) => (
            <Card as="li" key={l.name}>
              <h3 className="text-lg font-medium text-fg">{l.name}</h3>
              <p className="text-sm text-accent">{l.role}</p>
              <p className="mt-3 text-fg-muted">{l.focus}</p>
            </Card>
          ))}
        </ul>
        <Todo className="mt-6">Leadership photos and LinkedIn links, if wanted.</Todo>
      </Section>

      <div className="border-t border-border">
        <Partners headingId="co-partners-title" />
      </div>

      <ClosingCta />
    </>
  );
}
