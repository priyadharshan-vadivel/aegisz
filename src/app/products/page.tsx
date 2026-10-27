import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { ClosingCta } from "@/components/sections/home";
import { home } from "@/content/home";
import { iaac } from "@/content/iaac";
import { linesOfBusiness } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "AegisZ is building a family of AI-driven security products on one shared platform, from code to cloud to runtime to data. First in market: IAAC, Intent-Aware Access Control.",
  path: "/products",
});

export default function ProductsPage() {
  const p = home.portfolio;
  return (
    <>
      <Section labelledBy="products-title">
        <SectionHeading
          id="products-title"
          as="h1"
          eyebrow="Product portfolio"
          title="AI security platforms, built on one core"
          body={<p>{p.body}</p>}
        />
      </Section>

      <Section labelledBy="available-title" tone="surface" className="pt-0 sm:pt-section">
        <h2 id="available-title" className="sr-only">
          Available products
        </h2>
        <Card as="article" className="grid gap-8 p-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-semibold text-fg">{iaac.name}</h3>
              <StatusBadge status={iaac.status} />
            </div>
            <p className="mt-1 text-fg-muted">{iaac.fullName}</p>
            <p className="mt-6 text-lg text-fg">{iaac.headline}</p>
            <p className="mt-2 text-fg-muted">{iaac.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={iaac.href}>
                Explore IAAC <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
              <LinkButton href="/contact?interest=iaac-demo" variant="secondary">
                Book a demo
              </LinkButton>
            </div>
          </div>
          <dl className="grid content-start gap-4 text-sm">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">Protects</dt>
              <dd className="mt-1 text-fg-muted">{iaac.oneLiner}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">Runs on</dt>
              <dd className="mt-1 text-fg-muted">Linux servers today; Windows, macOS, containers and Kubernetes on the roadmap.</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">Deployment</dt>
              <dd className="mt-1 text-fg-muted">Per protected server, or Sovereign: dedicated, air-gapped and self-hosted.</dd>
            </div>
          </dl>
        </Card>
      </Section>

      <Section labelledBy="platform-title">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading id="platform-title" eyebrow="One platform" title="Each new product strengthens the others" />
          <div className="space-y-4 text-lg text-fg-muted">
            <p>{p.shared}</p>
            <p>
              Beyond these, AegisZ&apos;s long-term direction is a broader portfolio of AI and cybersecurity products,
              built in India to compete with the best in the world.
            </p>
          </div>
        </div>
        <ol aria-label="Platform coverage" className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {p.layers.map((layer) => (
            <li key={layer} className="rounded-lg border border-border bg-surface p-5">
              <p className="font-medium text-fg">{layer}</p>
              <p className="mt-1 text-sm text-fg-muted">
                {layer === "Runtime" ? "IAAC, available now" : "On the shared platform"}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="lob-title" tone="surface">
        <SectionHeading
          id="lob-title"
          eyebrow="Two ways to work with us"
          title="Standard products or a product built to your requirement"
        />
        <Table
          className="mt-10"
          caption="Standard products compared with security design services"
          head={["", ...linesOfBusiness.columns]}
          rows={linesOfBusiness.rows.map((r) => [r.label, ...r.values])}
        />
        <LinkButton href="/design-services" variant="secondary" className="mt-8">
          About security design services <ArrowRight className="size-4" aria-hidden />
        </LinkButton>
      </Section>

      <ClosingCta />
    </>
  );
}
