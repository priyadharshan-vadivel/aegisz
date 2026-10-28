import { Section, SectionHeading } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How AegisZ handles personal data.",
  path: "/privacy",
});

// TODO: full privacy notice from legal (India's DPDP Act and GDPR): what the contact and download
// forms collect, purpose, retention, processors (Resend, Cloudflare Turnstile, Vercel) and rights.
export default function PrivacyPage() {
  return (
    <Section labelledBy="privacy-title" className="pt-14 sm:pt-20">
      <SectionHeading
        id="privacy-title"
        as="h1"
        eyebrow="Legal"
        title="Privacy notice"
        body={
          <>
            <p>
              When you contact us or download the IAAC overview, we use your name, work email and company only to reply to
              you. We never sell them.
            </p>
            <p className="mt-4">
              Our full privacy notice is being finalised. Questions about your data? Email{" "}
              <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
          </>
        }
      />
    </Section>
  );
}
