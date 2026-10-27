import { Section, SectionHeading } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms of use for the AegisZ website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Section labelledBy="terms-title">
      <SectionHeading id="terms-title" as="h1" eyebrow="Legal" title="Terms of use" />
      <Todo className="mt-10 max-w-3xl">Website terms of use from legal.</Todo>
    </Section>
  );
}
