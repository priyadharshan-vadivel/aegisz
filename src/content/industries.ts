export type Industry = {
  slug: string;
  name: string;
  short: string;
  why: string;
  points: string[];
};

export const industriesIntro =
  "AegisZ serves organisations where a single misused privileged command can become a board-level or national-level event.";

export const industries: Industry[] = [
  {
    slug: "government",
    name: "Government and public sector",
    short: "Government",
    why: "Citizen data and critical services; need for Indian-built, sovereign, air-gapped security.",
    points: [
      "Security built, hosted and controlled in India",
      "Sovereign, air-gapped deployment where nothing leaves the network",
      "Security design services for requirement-led government projects",
    ],
  },
  {
    slug: "bfsi",
    name: "Banking, financial services and insurance",
    short: "BFSI",
    why: "Privileged-access risk, strict audit needs (PCI-DSS, RBI and IRDAI cyber expectations).",
    points: [
      "Dual approval and N-of-M quorum for destructive commands",
      "Tamper-evident, hash-chained audit with one-click verified export",
      "Compliance evidence for PCI-DSS and India's DPDP Act",
    ],
  },
  {
    slug: "saas",
    name: "SaaS and technology companies",
    short: "SaaS & technology",
    why: "Large Linux fleets, production access by many engineers, SOC 2 and ISO 27001 audits.",
    points: [
      "Intent checks on every production command, by every engineer",
      "Observe-first rollout: monitor mode, then enforcement",
      "Evidence for SOC 2 and ISO 27001 audits",
    ],
  },
  {
    slug: "critical-infrastructure",
    name: "Critical infrastructure and defence",
    short: "Critical infrastructure",
    why: "Environments where nothing may leave the network.",
    points: [
      "On-box AI with zero data egress for analysis",
      "Fully air-gapped Sovereign deployment",
      "The most catastrophic actions can never be released",
    ],
  },
];

// Fifth segment from the profile, shown as a note under the four primary industries.
export const regulatedNote = {
  name: "Regulated enterprises handling personal data",
  why: "Evidence for India's DPDP Act and global privacy rules.",
};
