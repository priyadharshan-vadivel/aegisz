import { Section, SectionHeading } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Trust & responsible disclosure",
  description: "How to report a security vulnerability in AegisZ products or websites, and what you can expect from us.",
  path: "/trust",
});

export default function TrustPage() {
  return (
    <Section labelledBy="trust-title" className="pt-14 sm:pt-20">
      <SectionHeading
        id="trust-title"
        as="h1"
        eyebrow="Trust"
        title="Responsible disclosure"
        body={
          <p>
            We build security products, so we take reports about our own security seriously. If you believe you&apos;ve
            found a vulnerability in an AegisZ product or website, please tell us.
          </p>
        }
      />
      <Prose className="mt-6">
        <h2>How to report</h2>
        <p>
          Email <a href={`mailto:${site.securityEmail}`}>{site.securityEmail}</a> with:
        </p>
        <ul>
          <li>a description of the issue and its potential impact;</li>
          <li>the affected product, version, URL or component;</li>
          <li>steps to reproduce, and proof-of-concept code if you have it;</li>
          <li>how you&apos;d like to be credited, if at all.</li>
        </ul>
        <p>
          Our machine-readable contact details are published at <a href="/.well-known/security.txt">/.well-known/security.txt</a>.
        </p>

        <h2>In scope</h2>
        <ul>
          <li>aegisz.in and its subdomains</li>
          <li>AegisZ products, including IAAC agents and control plane</li>
        </ul>

        <h2>Please don&apos;t</h2>
        <ul>
          <li>access, change or delete data that isn&apos;t yours;</li>
          <li>run denial-of-service, spam or social-engineering tests;</li>
          <li>test against customer environments without their written permission;</li>
          <li>disclose the issue publicly before we&apos;ve had a reasonable chance to fix it.</li>
        </ul>

        <h2>What you can expect</h2>
        <ul>
          <li>An acknowledgement of your report.</li>
          <li>Updates as we investigate and fix the issue.</li>
          <li>Credit, if you want it, once the issue is resolved.</li>
        </ul>
        <p>
          We won&apos;t pursue legal action against researchers who act in good faith and follow this policy.
        </p>
      </Prose>
      {/* TODO: confirm a dedicated reporting address (security@aegisz.in?), PGP key and response times;
          legal review of the safe-harbour wording before launch. */}
    </Section>
  );
}
