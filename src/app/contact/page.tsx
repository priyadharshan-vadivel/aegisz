import { Suspense } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/content/site";
import { partners } from "@/content/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Book a demo",
  description:
    "Book an IAAC demo or talk to AegisZ about a sovereign deployment, security design services or partnership.",
  path: "/contact",
});

export default function ContactPage() {
  const channel = partners.find((p) => p.name === "Metier Genesis")!;
  return (
    <Section labelledBy="contact-title">
      <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <SectionHeading
            id="contact-title"
            as="h1"
            eyebrow="Contact"
            title="Book a demo"
            body={<p>See IAAC judge real commands, or tell us about a requirement you need built.</p>}
          />
          <div className="mt-10">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
        </div>

        <aside aria-labelledby="direct-title" className="space-y-8 lg:pt-28">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 id="direct-title" className="font-medium text-fg">
              Contact us directly
            </h2>
            <ul className="mt-4 space-y-3 text-fg-muted">
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                <a href={`mailto:${site.email}`} className="hover:text-fg">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-accent" aria-hidden />
                <a href={site.phoneHref} className="hover:text-fg">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                <span>{site.location}</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-6 text-sm text-fg-muted">
            <h2 className="font-medium text-fg">Outside India?</h2>
            <p className="mt-2">
              AegisZ products are also available through our global channel partner,{" "}
              <a href={channel.href} target="_blank" rel="noopener noreferrer" className="text-fg underline">
                {channel.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          </div>
          <div className="rounded-lg border border-border p-6 text-sm text-fg-muted">
            <h2 className="font-medium text-fg">Reporting a vulnerability?</h2>
            <p className="mt-2">
              Please follow our{" "}
              <Link href="/trust" className="text-fg underline">
                responsible disclosure policy
              </Link>{" "}
              instead of this form.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
