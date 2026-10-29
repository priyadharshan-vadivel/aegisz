import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontMono, fontSans } from "@/styles/fonts";
import { companyLinkedIn, site } from "@/content/site";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CardGlowTracker } from "@/components/motion/CardGlowTracker";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI-driven cybersecurity platforms, built in India`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    siteName: site.name,
    locale: "en_IN",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  // Icons come from src/app/favicon.ico, icon.png and apple-icon.png (scripts/make-icons.mjs).
};

/** Organization structured data: lets Google show the AegisZ logo and name in results. */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.png`,
  email: site.email,
  ...(companyLinkedIn && { sameAs: [companyLinkedIn] }),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    // Browser UI colour can't read CSS variables; keep in sync with --ae-bg in theme.css.
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="dark" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          // Static object built from site constants, never user input. Escape "<" so it can't close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <CardGlowTracker />
        </ThemeProvider>
      </body>
    </html>
  );
}
