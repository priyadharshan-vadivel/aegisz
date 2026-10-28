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
  { label: "Products", href: "/products" },
  { label: "IAAC", href: "/products/iaac" },
  { label: "Design services", href: "/design-services" },
  { label: "Industries", href: "/industries" },
  { label: "Company", href: "/company" },
];

export const demoCta: NavItem = { label: "Book a demo", href: "/contact?interest=iaac-demo" };

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Products",
    items: [
      { label: "Portfolio", href: "/products" },
      { label: "IAAC", href: "/products/iaac" },
    ],
  },
  {
    heading: "Solutions",
    items: [
      { label: "Design services", href: "/design-services" },
      { label: "Industries", href: "/industries" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/company" },
      { label: "Contact", href: "/contact" },
      { label: "Trust & disclosure", href: "/trust" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Responsible disclosure", href: "/trust" },
];
