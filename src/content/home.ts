export const home = {
  hero: {
    eyebrow: "AegisZ · Coimbatore, India",
    // Rendered as three lines; the last is muted.
    titleLines: ["AI-driven cybersecurity,", "built in India", "for enterprises and governments."],
    body: "We build and own the security platforms that protect enterprise and government infrastructure, from India, for the world.",
  },
  problem: {
    eyebrow: "Why we exist",
    lines: ["Attackers log in.", "They don't break in.", "They use your own tools."],
    closer: "Our products judge what an action is trying to do, not just whether the user is allowed to do it.",
  },
  whatWeDo: {
    eyebrow: "What we do",
    title: "Two ways to work with us",
    cards: [
      {
        key: "products",
        title: "Standard products",
        body: "Ready-to-deploy AI security platforms for enterprises that need proven protection fast.",
        chips: ["IAAC available now", "Per-server or sovereign licence", "AegisZ IP"],
        href: "/products",
        cta: "Explore products",
      },
      {
        key: "services",
        title: "Security design services",
        body: "Security products built to a specific government or enterprise requirement, on the same core as IAAC.",
        chips: ["Requirement-led", "Sovereign / air-gapped", "Built on AegisZ technology"],
        href: "/design-services",
        cta: "How an engagement runs",
      },
    ],
  },
  portfolio: {
    eyebrow: "Product portfolio",
    title: "One platform, from code to data",
    body: "A family of security products on one shared platform. IAAC is the first in market; the rest follows on the same core.",
    layers: ["Code", "Cloud", "Runtime", "Data"],
    shared:
      "Every product shares a common security graph and a multi-tenant control plane. What one product learns about an environment, the rest can use.",
  },
  why: {
    eyebrow: "Why AegisZ",
    title: "The layer existing tools leave empty",
    body: "Enforcing intent at the command, on the host, in real time.",
    items: [
      { icon: "shield", title: "Prevention, not detection", body: "We stop the harmful action before it runs." },
      { icon: "server", title: "Sovereign by architecture", body: "AI runs inside your environment, air-gapped if needed." },
      { icon: "flag", title: "Built and owned in India", body: "Our IP is developed in-house, for government and critical sectors." },
      { icon: "users", title: "Humans stay in control", body: "AI advises; a person decides, with dual approval and quorum." },
    ],
  },
  closing: {
    title: "See IAAC stop a command before it runs.",
    body: "Book a demo, or talk to us about a sovereign deployment or a security product built to your requirement.",
  },
};
