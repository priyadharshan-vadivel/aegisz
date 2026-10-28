import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { VerdictBadge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="flex min-h-[75vh] items-center overflow-hidden">
      <Container className="glow py-section text-center">
        <p className="flex items-center justify-center gap-3 font-mono text-sm text-fg-subtle">
          404 <VerdictBadge verdict="block" live />
        </p>
        <h1 id="nf-title" className="mx-auto mt-8 max-w-[14ch] text-h1 text-fg">
          This page doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-6 max-w-measure text-lead text-fg-muted">The link may be old, or the address mistyped.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/" size="lg">
            Go to home
          </LinkButton>
          <LinkButton href="/products" variant="secondary" size="lg">
            Explore products
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
