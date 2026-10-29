export const site = {
  name: "AegisZ",
  url: "https://aegisz.in",
  tagline: "AI-driven cybersecurity platforms for enterprises and governments, from India, for the world.",
  description:
    "AegisZ is an Indian cybersecurity product company building AI-driven security platforms that protect enterprise and government infrastructure. First in market: IAAC, Intent-Aware Access Control.",
  location: "Coimbatore, Tamil Nadu, India",
  email: "contact@aegisz.in",
  phone: "+91 90808 83442",
  phoneHref: "tel:+919080883442",
  // TODO: confirm a dedicated security reporting address (e.g. security@aegisz.in) for /trust and security.txt
  securityEmail: "contact@aegisz.in",
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Design Services", href: "/design-services" },
  { label: "Contact", href: "/contact" },
];

/** Cal.id scheduler. Every "Book a demo" CTA opens it in a new tab. */
export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.id/priyadharshan-aegisz";

export const demoCta: NavItem = { label: "Book a demo", href: bookingUrl };

export const footerNav: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "IAAC", href: "/products/iaac" },
  { label: "Design Services", href: "/design-services" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Trust", href: "/trust" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

// Company LinkedIn page. Footer shows the link only once this is set.
// TODO: add the company LinkedIn URL when the page exists.
export const companyLinkedIn: string | null = null;
