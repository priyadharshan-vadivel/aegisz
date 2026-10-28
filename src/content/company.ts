export const company = {
  overview: [
    "AegisZ is an Indian cybersecurity product company. We design, build and own a growing portfolio of AI-driven security platforms that protect enterprise and government infrastructure, from the code that is written to the data that is stored.",
    "Modern attackers rarely break in. They log in with stolen credentials, act as insiders, or use trusted system tools that look like normal admin work. Our products are built for that reality: they judge what an action is trying to do, not just whether the user is allowed to do it.",
    "All intellectual property is built and owned in-house. Products reach global markets through our channel partner, Metier Genesis.",
  ],
  vision:
    "To be among India's top 10 cybersecurity product makers by 2030, and a globally recognised name in protecting digital ecosystems.",
  mission: [
    {
      icon: "landmark",
      title: "Build a secure digital government for India",
      short: "Public systems protected by security built and controlled in India.",
      body: "Protect the public systems, data and services that citizens depend on, with security built and controlled in India.",
    },
    {
      icon: "cpu",
      title: "Make world-class security IP in India",
      short: "Design and own core security technology, not resell it.",
      body: "Design and own core cybersecurity technology rather than resell it.",
    },
    {
      icon: "lock",
      title: "Keep sensitive data sovereign",
      short: "Analysis runs inside your environment; critical data never leaves.",
      body: "Build products where analysis runs inside the customer's environment and critical data never has to leave it.",
    },
    {
      icon: "shield",
      title: "Stop damage before it happens",
      short: "Prevent harmful actions in real time, not report them after.",
      body: "Prevent harmful actions in real time instead of reporting them after the fact.",
    },
    {
      icon: "globe",
      title: "Deliver globally through trusted partners",
      short: "Indian-built security for every region we serve.",
      body: "Take Indian-built security to enterprises and governments in every region we serve.",
    },
  ],
  // photo: path under /public, or null until brand/team/ photos are supplied (initials are shown instead).
  // linkedin: null until URLs are supplied. No phone numbers on the site.
  leadership: [
    {
      name: "Priyadharshan Vadivel",
      initials: "PV",
      role: "Founder & CEO",
      // TODO: confirm two-line bio
      bio: "Leads strategy, partnerships and global go-to-market. Background in security research and penetration testing.",
      email: "priyadharshanv@aegisz.in",
      linkedin: null as string | null, // TODO: LinkedIn URL
      photo: null as string | null, // TODO: photo from brand/team/
    },
    {
      name: "Jejo J",
      initials: "JJ",
      role: "Co-founder & CTO",
      // TODO: confirm two-line bio
      bio: "Leads product architecture and engineering. Builds and ships the AegisZ platforms, starting with IAAC.",
      email: "jejo@aegisz.in",
      linkedin: null as string | null, // TODO: LinkedIn URL
      photo: null as string | null, // TODO: photo from brand/team/
    },
  ],
};

export const partners = [
  {
    name: "Metier Genesis",
    href: "https://metiergenesis.com/",
    domain: "metiergenesis.com",
    logo: "/partners/metier-genesis.png",
    role: "Global channel partner",
    roleDetail: "Sells and distributes AegisZ products",
    about:
      "UAE-based (Ajman Free Zone) digital transformation consultancy and technology distributor, founded 2016, active across the UAE, India, Africa and Canada.",
    why: "Gives AegisZ an established commercial presence in the GCC and beyond.",
  },
  {
    name: "Dedcell Security",
    href: "https://dedcellsecurity.in/",
    domain: "dedcellsecurity.in",
    logo: "/partners/dedcell.png",
    role: "Offensive security partner",
    roleDetail: "Penetration testing and validation",
    about:
      "India-based, expert-led penetration testing firm for startups: web, API, cloud and mobile testing, code review and remediation support.",
    why: "Attacker-side expertise that helps validate our products against real-world techniques and complements our defensive platforms for customers.",
  },
];
