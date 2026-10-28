import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ShieldPoster } from "@/components/three/ShieldPoster";
import { ClosingCta, ProductCards } from "@/components/sections/home";
import { layers } from "@/content/products";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "AegisZ is building a family of AI-driven security products on one shared platform, from code to cloud to runtime to data. First in market: IAAC, Intent-Aware Access Control.",
  path: "/products",
});

/** Code → Cloud → Runtime → Data, with Runtime (IAAC) lit. */
function Spine() {
  return (
    <ol aria-label="Platform coverage" className="relative grid grid-cols-4 gap-2">
      <span aria-hidden className="absolute top-5 right-[12.5%] left-[12.5%] h-px bg-gradient-to-r from-border-strong via-accent to-border-strong" />
      {layers.map((l) => {
        const live = l === "Runtime";
        return (
          <li key={l} className="relative flex flex-col items-center gap-3 text-center">
            <span
              aria-hidden
              className={cn(
                "grid size-10 place-items-center rounded-full border bg-bg",
                live ? "border-accent shadow-[0_0_24px_var(--color-accent)]" : "border-border-strong",
              )}
            >
              <span className={cn("size-2.5 rounded-full", live ? "bg-accent" : "bg-fg-subtle")} />
            </span>
            <span className={cn("text-[0.9375rem]", live ? "font-semibold text-fg" : "text-fg-muted")}>{l}</span>
            {live && <span className="text-sm text-accent-ink">IAAC</span>}
          </li>
        );
      })}
    </ol>
  );
}

export default function ProductsPage() {
  return (
    <>
      <section aria-labelledby="products-title" className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 lg:block">
          <ShieldPoster className="h-full w-full" />
        </div>
        <Container className="pt-14 pb-section sm:pt-20">
          <p className="label mb-6">Products</p>
          <h1 id="products-title" className="max-w-[14ch] text-h1 text-fg">
            One platform, from code to data
          </h1>
          <p className="mt-6 max-w-[40ch] text-lead text-fg-muted">
            Every AegisZ product shares one security graph and control plane. IAAC is first; the rest build on the same core.
          </p>
          <div className="mt-16 max-w-2xl">
            <Spine />
          </div>
        </Container>
      </section>

      <Section labelledBy="cards-title" tone="surface">
        <h2 id="cards-title" className="sr-only">
          All products
        </h2>
        <ProductCards headingLevel="h3" />
      </Section>

      <ClosingCta />
    </>
  );
}
