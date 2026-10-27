import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Section labelledBy="nf-title" className="min-h-[60vh]">
      <p className="font-mono text-sm text-block">404 · BLOCK</p>
      <h1 id="nf-title" className="mt-3 text-4xl font-semibold text-fg sm:text-5xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-fg-muted">The link may be old, or the address mistyped.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/">Go to home</LinkButton>
        <LinkButton href="/products" variant="secondary">
          Explore products
        </LinkButton>
      </div>
    </Section>
  );
}
