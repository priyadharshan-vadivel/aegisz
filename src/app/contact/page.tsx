import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { BookingEmbed } from "@/components/sections/BookingEmbed";
import { ContactForm } from "@/components/sections/ContactForm";
import { bookingUrl, site } from "@/content/site";
import { partners } from "@/content/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Book a demo",
  description:
    "Book an IAAC demo, or send AegisZ a message about a sovereign deployment, security design services or partnership.",
  path: "/contact",
});

export default function ContactPage() {
  const channel = partners.find((p) => p.name === "Metier Genesis")!;
  return (
    <>
      {/* 1. Book a demo (Cal.id) */}
      <Section labelledBy="contact-title" className="pt-14 sm:pt-20">
        <SectionHeading
          id="contact-title"
          as="h1"
          eyebrow="Contact"
          title="Book a demo"
          body={<p>Pick a time that suits you. We&apos;ll show IAAC judging real commands.</p>}
        />
        <div className="mt-10">
          <LinkButton href={bookingUrl} size="lg" className="w-full sm:w-auto">
            Open the scheduler
          </LinkButton>
        </div>
        <div className="mt-10">
          <BookingEmbed />
        </div>
      </Section>

      {/* 2. Or send us a message */}
      <Section labelledBy="message-title" tone="surface">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              id="message-title"
              eyebrow="Message"
              title="Or send us a message"
              body={<p>Questions about IAAC, a sovereign deployment, design services or partnership.</p>}
            />
            <div className="mt-12">
              <ContactForm />
            </div>
          </div>

          <aside aria-labelledby="direct-title" className="space-y-3 lg:pt-48">
            <div className="rounded-tile border border-border bg-bg p-7 sm:p-8">
              <h2 id="direct-title" className="label">
                Contact us directly
              </h2>
              <ul className="mt-6 space-y-4 text-lead text-fg">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-fg-subtle" aria-hidden strokeWidth={1.5} />
                  <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-fg-subtle" aria-hidden strokeWidth={1.5} />
                  <a href={site.phoneHref} className="underline-offset-4 hover:underline">
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="size-4 shrink-0 text-fg-subtle" aria-hidden strokeWidth={1.5} />
                  <span>{site.location}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-tile border border-border p-7 text-fg-muted sm:p-8">
              <h2 className="text-h3 text-fg">Outside India?</h2>
              <p className="mt-3">
                AegisZ products are also available through our global channel partner,{" "}
                <a href={channel.href} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4">
                  {channel.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                .
              </p>
            </div>
            <div className="rounded-tile border border-border p-7 text-fg-muted sm:p-8">
              <h2 className="text-h3 text-fg">Reporting a vulnerability?</h2>
              <p className="mt-3">
                Please follow our{" "}
                <Link href="/trust" className="text-fg underline underline-offset-4">
                  responsible disclosure policy
                </Link>{" "}
                instead of this form.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
