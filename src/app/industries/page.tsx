import { Building2, Factory, Landmark, Server } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ClosingCta } from "@/components/sections/home";
import { industries, industriesIntro, regulatedNote } from "@/content/industries";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "AegisZ serves government, banking and insurance, SaaS and technology, and critical infrastructure: organisations where a single misused privileged command can become a board-level or national-level event.",
  path: "/industries",
});

const icons: Record<string, typeof Landmark> = {
  government: Landmark,
  bfsi: Building2,
  saas: Server,
  "critical-infrastructure": Factory,
};

export default function IndustriesPage() {
  return (
    <>
      <Section labelledBy="ind-title" className="pt-14 sm:pt-20">
        <SectionHeading id="ind-title" as="h1" eyebrow="Industries" title="Who we serve" body={<p>{industriesIntro}</p>} />
        <nav aria-label="Industries on this page" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i.slug}>
                <a
                  href={`#${i.slug}`}
                  // Sans, not mono: mono's fallback metrics differ enough to re-wrap this row on font swap (CLS).
                  className="inline-block rounded-pill border border-border-strong px-4 py-2 text-sm text-fg-muted transition-colors hover:border-fg-subtle hover:text-fg"
                >
                  {i.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      {industries.map((ind) => {
        const Icon = icons[ind.slug];
        return (
          <section key={ind.slug} id={ind.slug} aria-labelledby={`${ind.slug}-title`} className="border-t border-border py-section">
            <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
              <div>
                <Icon className="size-6 text-fg-subtle" aria-hidden strokeWidth={1.5} />
                <h2 id={`${ind.slug}-title`} className="mt-6 text-h2 text-fg">
                  {ind.name}
                </h2>
                <p className="mt-6 max-w-measure text-lead text-fg-muted">{ind.why}</p>
              </div>
              <div className="lg:pt-14">
                <h3 className="label">How AegisZ helps</h3>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {ind.points.map((p, i) => (
                    <Reveal as="li" key={p} delay={i * 0.06} className="py-5 text-lead text-fg">
                      {p}
                    </Reveal>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        );
      })}

      <section aria-labelledby="reg-title" className="pb-section">
        <Container>
          <div className="rounded-tile border border-border bg-surface p-8 sm:p-10">
            <h2 id="reg-title" className="text-h3 text-fg">
              Also: {regulatedNote.name}
            </h2>
            <p className="mt-3 text-lead text-fg-muted">{regulatedNote.why}</p>
          </div>
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}
