import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

// A page-level openGraph object replaces the root one, so the shared image is set explicitly.
const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — AI-driven cybersecurity platforms` };

export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
      images: [ogImage.url],
    },
  };
}
