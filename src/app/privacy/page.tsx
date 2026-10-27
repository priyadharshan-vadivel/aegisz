import { Section, SectionHeading } from "@/components/ui/Section";
import { Todo } from "@/components/ui/Todo";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How AegisZ handles personal data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section labelledBy="privacy-title">
      <SectionHeading
        id="privacy-title"
        as="h1"
        eyebrow="Legal"
        title="Privacy notice"
        body={
          <p>
            Questions about privacy? Email <a href={`mailto:${site.email}`} className="text-fg underline">{site.email}</a>.
          </p>
        }
      />
      <Todo className="mt-10 max-w-3xl">
        Full privacy notice from legal, covering India&apos;s DPDP Act and GDPR: what the contact form collects, the
        purpose, retention, processors, and data-subject rights.
      </Todo>
    </Section>
  );
}
