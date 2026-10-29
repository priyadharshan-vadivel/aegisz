import { Container } from "@/components/ui/Container";
import { ShieldPoster } from "@/components/three/ShieldPoster";
import { ClosingCta, IaacCard, MoreProductsNote } from "@/components/sections/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "IAAC, Intent-Aware Access Control, stops harmful commands on Linux servers before they run, even as root.",
  path: "/products",
});

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
            Our products
          </h1>
          <p className="mt-6 max-w-[40ch] text-lead text-fg-muted">
            AI-driven security that judges what a command is trying to do, before it runs.
          </p>
          <div className="mt-16 max-w-3xl">
            <IaacCard headingLevel="h2" />
            <MoreProductsNote />
          </div>
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}
