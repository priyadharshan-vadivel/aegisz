import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Bento, span } from "@/components/ui/Bento";
import { Reveal } from "@/components/motion/Reveal";
import { ClosingCta } from "@/components/sections/home";
import { designServices } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Security design services",
  description:
    "When an off-the-shelf product doesn't fit, AegisZ designs and builds a security product to your exact requirement, on the same core technology that powers IAAC.",
  path: "/design-services",
});

const terms = [
  { k: "Best for", v: "Governments and enterprises with unique, regulated or sovereign needs" },
  { k: "Commercial model", v: "Project-based design and build, then licence and support" },
  { k: "Ownership", v: "Built on AegisZ technology; terms agreed per engagement" },
];

export default function DesignServicesPage() {
  return (
    <>
      <Section labelledBy="ds-title" className="pt-14 sm:pt-20">
        <SectionHeading
          id="ds-title"
          as="h1"
          eyebrow="Security design services"
          title="Security products engineered to your requirement"
          body={<p>{designServices.summary}</p>}
        />
        <dl className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-3">
          {terms.map((x) => (
            <div key={x.k}>
              <dt className="label">{x.k}</dt>
              <dd className="mt-3 text-lead text-fg">{x.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section labelledBy="eng-title" tone="surface">
        <SectionHeading id="eng-title" eyebrow="Typical engagements" title="Where a custom build fits" />
        <Bento as="ul" className="mt-16">
          {designServices.engagements.map((e, i) => (
            <Reveal as="li" key={e} delay={(i % 2) * 0.08} className={i === 0 || i === 3 ? span.twoThirds : span.third}>
              <Card className="flex h-full min-h-48 items-end bg-bg">
                <p className={i === 0 || i === 3 ? "text-h3 text-fg" : "text-lead text-fg"}>{e}</p>
              </Card>
            </Reveal>
          ))}
        </Bento>
      </Section>

      <Section labelledBy="process-title">
        <SectionHeading id="process-title" eyebrow="How an engagement runs" title="Four steps, from requirement to support" />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-tile border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {designServices.process.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="bg-bg p-8">
              <p className="font-mono text-sm text-accent-ink">0{i + 1}</p>
              <h3 className="mt-6 text-h3 text-fg">{s.title}</h3>
              <p className="mt-3 text-fg-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <ClosingCta
        title="Have a requirement off-the-shelf tools can't meet?"
        body="Tell us the threat model, compliance obligations and operating environment. We'll come back with an architecture and scope."
      />
    </>
  );
}
