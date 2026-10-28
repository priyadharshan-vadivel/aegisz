import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ArrowLink, LinkButton } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { Bento, span } from "@/components/ui/Bento";
import { Reveal } from "@/components/motion/Reveal";
import { Terminal } from "@/components/sections/Terminal";
import { ClosingCta } from "@/components/sections/home";
import { home } from "@/content/home";
import { iaac } from "@/content/iaac";
import { linesOfBusiness } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "AegisZ is building a family of AI-driven security products on one shared platform, from code to cloud to runtime to data. First in market: IAAC, Intent-Aware Access Control.",
  path: "/products",
});

const facts = [
  { k: "Protects", v: iaac.oneLiner },
  { k: "Runs on", v: "Linux servers today; Windows, macOS, containers and Kubernetes on the roadmap." },
  { k: "Deployment", v: "Per protected server, or Sovereign: dedicated, air-gapped and self-hosted." },
];

export default function ProductsPage() {
  const p = home.portfolio;
  return (
    <>
      <Section labelledBy="products-title" className="pt-14 sm:pt-20">
        <SectionHeading
          id="products-title"
          as="h1"
          eyebrow="Product portfolio"
          title="AI security platforms, built on one core"
          body={<p>{p.body}</p>}
        />
      </Section>

      <Section labelledBy="available-title" className="pt-0">
        <h2 id="available-title" className="sr-only">
          Available products
        </h2>
        <Bento>
          <Reveal className={span.full}>
            <Card as="article" className="grid gap-12 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-h1 text-fg">{iaac.name}</h3>
                  <StatusBadge status={iaac.status} />
                </div>
                <p className="mt-2 text-fg-muted">{iaac.fullName}</p>
                <p className="mt-8 text-h3 text-fg">{iaac.headline}</p>
                <p className="mt-3 text-fg-muted">{iaac.summary}</p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <LinkButton href={iaac.href}>Explore IAAC →</LinkButton>
                  <LinkButton href="/contact?interest=iaac-demo" variant="secondary">
                    Book a demo
                  </LinkButton>
                </div>
              </div>
              <Terminal still lit />
            </Card>
          </Reveal>
          {facts.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.06} className={span.third}>
              <Card className="h-full">
                <p className="label">{f.k}</p>
                <p className="mt-4 text-lead text-fg">{f.v}</p>
              </Card>
            </Reveal>
          ))}
        </Bento>
      </Section>

      <Section labelledBy="platform-title" tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading id="platform-title" eyebrow="One platform" title="Each new product strengthens the others" />
          <div className="space-y-5 text-lead text-fg-muted lg:pt-12">
            <p>{p.shared}</p>
            <p>
              Beyond these, AegisZ&apos;s long-term direction is a broader portfolio of AI and cybersecurity products,
              built in India to compete with the best in the world.
            </p>
          </div>
        </div>
        <ol aria-label="Platform coverage" className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {p.layers.map((layer, i) => {
            const live = layer === "Runtime";
            return (
              <Reveal as="li" key={layer} delay={i * 0.06}>
                <div
                  className={cn(
                    "flex min-h-40 h-full flex-col justify-between rounded-tile border bg-bg p-6",
                    live ? "border-accent" : "border-border",
                  )}
                >
                  <span aria-hidden className={cn("size-2 rounded-full", live ? "bg-accent" : "bg-border-strong")} />
                  <div>
                    <p className={cn("text-h3", live ? "text-fg" : "text-fg-muted")}>{layer}</p>
                    <p className="mt-1 text-sm text-fg-subtle">{live ? "IAAC, available now" : "On the shared platform"}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      <Section labelledBy="lob-title">
        <SectionHeading
          id="lob-title"
          eyebrow="Two ways to work with us"
          title="Standard products or a product built to your requirement"
        />
        <Table
          className="mt-14"
          caption="Standard products compared with security design services"
          head={["", ...linesOfBusiness.columns]}
          rows={linesOfBusiness.rows.map((r) => [r.label, ...r.values])}
        />
        <ArrowLink href="/design-services" className="mt-10">
          About security design services
        </ArrowLink>
      </Section>

      <ClosingCta />
    </>
  );
}
