import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ClosingCta } from "@/components/sections/home";
import { designServices } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Security design services",
  description:
    "When an off-the-shelf product doesn't fit, AegisZ designs and builds a security product to your exact requirement, on the same core technology that powers IAAC.",
  path: "/design-services",
});

export default function DesignServicesPage() {
  return (
    <>
      <Section labelledBy="ds-title">
        <SectionHeading
          id="ds-title"
          as="h1"
          eyebrow="Security design services"
          title="Security products engineered to your requirement"
          body={<p>{designServices.summary}</p>}
        />
        <dl className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { k: "Best for", v: "Governments and enterprises with unique, regulated or sovereign needs" },
            { k: "Commercial model", v: "Project-based design and build, then licence and support" },
            { k: "Ownership", v: "Built on AegisZ technology; terms agreed per engagement" },
          ].map((x) => (
            <div key={x.k} className="rounded-lg border border-border p-5">
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">{x.k}</dt>
              <dd className="mt-2 text-fg-muted">{x.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section labelledBy="eng-title" tone="surface">
        <SectionHeading id="eng-title" eyebrow="Typical engagements" title="Where a custom build fits" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {designServices.engagements.map((e) => (
            <Card as="li" key={e} className="flex gap-3">
              <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
              <span className="text-fg">{e}</span>
            </Card>
          ))}
        </ul>
      </Section>

      <Section labelledBy="process-title">
        <SectionHeading id="process-title" eyebrow="How an engagement runs" title="Four steps, from requirement to support" />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {designServices.process.map((s, i) => (
            <li key={s.title} className="border-t border-border-strong pt-5">
              <p className="font-mono text-sm text-accent">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-medium text-fg">{s.title}</h3>
              <p className="mt-2 text-fg-muted">{s.body}</p>
            </li>
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
