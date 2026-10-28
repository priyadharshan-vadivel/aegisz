import type { ProductStatus } from "@/components/ui/Badge";

/*
 * Portfolio as shown on Home and /products. Upcoming products are deliberately unnamed and
 * described by platform layer only (don't disclose product names until launch).
 */

export const layers = ["Code", "Cloud", "Runtime", "Data"] as const;
export type Layer = (typeof layers)[number];

export type ProductCard = {
  key: string;
  layer: Layer;
  name: string;
  line: string;
  status: ProductStatus;
  href?: string;
};

export const productCards: ProductCard[] = [
  {
    key: "iaac",
    layer: "Runtime",
    name: "IAAC",
    line: "Stops harmful commands before they run, even as root.",
    status: "available",
    href: "/products/iaac",
  },
  { key: "code", layer: "Code", name: "Code security", line: "Secure what ships.", status: "in-development" },
  { key: "cloud", layer: "Cloud", name: "Cloud security", line: "Posture across every cloud.", status: "roadmap" },
  { key: "data", layer: "Data", name: "Data security", line: "Protect what's stored.", status: "roadmap" },
];
