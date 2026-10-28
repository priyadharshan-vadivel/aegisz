import { Section, SectionHeading } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms of use for the AegisZ website.",
  path: "/terms",
});

// TODO: website terms of use from legal.
export default function TermsPage() {
  return (
    <Section labelledBy="terms-title" className="pt-14 sm:pt-20">
      <SectionHeading
        id="terms-title"
        as="h1"
        eyebrow="Legal"
        title="Terms of use"
        body={
          <p>
            Our full terms of use are being finalised. For any question about using this site, email{" "}
            <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        }
      />
    </Section>
  );
}
