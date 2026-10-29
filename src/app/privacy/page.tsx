import { Section, SectionHeading } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "What personal data AegisZ collects through this website, why, where it's stored, and how to have it deleted.",
  path: "/privacy",
});

// Draft, pending legal review. Aligned with India's Digital Personal Data Protection Act, 2023.
// Update LAST_UPDATED whenever the text changes.
const LAST_UPDATED = "29 October 2026";

const mail = (
  <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
    {site.email}
  </a>
);

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <p>
        AegisZ is a cybersecurity product company based in {site.location}. We decide how the personal data described here
        is used. Questions about it go to {mail}.
      </p>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>
          When you send us a message or ask for the IAAC overview, we collect your name, work email, phone number and
          company. The contact form also asks for your role and a message, both optional.
        </p>
        <p>
          To stop abuse, we also record your browser type and a one-way hash of your network address. We never store the
          address itself.
        </p>
      </>
    ),
  },
  {
    id: "why",
    title: "Why we collect it",
    body: (
      <p>
        Only to respond to your request: to reply to your message, arrange a demo, or send you the IAAC overview. We
        don&apos;t use it for marketing unless you ask us to.
      </p>
    ),
  },
  {
    id: "basis",
    title: "Your consent",
    body: (
      <p>
        We process your details because you agree to it when you tick the consent box on our forms. You can withdraw that
        consent at any time, as described below.
      </p>
    ),
  },
  {
    id: "where",
    title: "Where it's stored",
    body: (
      <p>
        Your details are stored in our database (Neon, hosted through Vercel) and pass through our email provider (Resend)
        so we can reply. Cloudflare Turnstile checks that forms are sent by people, not bots. If you book a demo, the
        booking is handled by Cal.id under its own privacy policy.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: <p>We delete your details 24 months after you last contacted us, or sooner if you ask us to.</p>,
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <p>
        You can ask to see the details we hold about you, correct them, have them deleted, or withdraw your consent. Email{" "}
        {mail} and we&apos;ll act on it.
      </p>
    ),
  },
  {
    id: "selling",
    title: "We never sell your data",
    body: <p>We don&apos;t sell, rent or trade your personal data to anyone.</p>,
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: <p>If we change how we handle your data, we&apos;ll update this page and the date below.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <Section labelledBy="privacy-title" className="pt-14 sm:pt-20">
      <SectionHeading
        id="privacy-title"
        as="h1"
        eyebrow="Legal"
        title="Privacy notice"
        body={<p>What we collect through this website, why, and how to have it deleted.</p>}
      />
      <div className="mt-16 max-w-measure space-y-12">
        {sections.map((s) => (
          <section key={s.id} aria-labelledby={`privacy-${s.id}`}>
            <h2 id={`privacy-${s.id}`} className="text-h3 text-fg">
              {s.title}
            </h2>
            <div className="mt-3 space-y-3 text-fg-muted">{s.body}</div>
          </section>
        ))}
        <p className="text-sm text-fg-subtle">Last updated: {LAST_UPDATED}</p>
      </div>
    </Section>
  );
}
