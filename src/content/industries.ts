export type Industry = {
  slug: string;
  icon: "landmark" | "bank" | "server" | "factory";
  name: string;
  short: string;
  /** One line: the sector's core need. */
  need: string;
  /** Three short chips: how AegisZ helps. */
  chips: string[];
  why: string;
  points: string[];
};

export const industriesIntro =
  "AegisZ serves organisations where a single misused privileged command can become a board-level or national-level event.";

export const industries: Industry[] = [
  {
    slug: "government",
    icon: "landmark",
    name: "Government and public sector",
    short: "Government",
    need: "Indian-built, sovereign security for citizen data and critical services.",
    chips: ["Built in India", "Air-gapped", "Custom builds"],
    why: "Citizen data and critical services; need for Indian-built, sovereign, air-gapped security.",
    points: [
      "Security built, hosted and controlled in India",
      "Sovereign, air-gapped deployment where nothing leaves the network",
      "Security design services for requirement-led government projects",
    ],
  },
  {
    slug: "bfsi",
    icon: "bank",
    name: "Banking, financial services and insurance",
    short: "BFSI",
    need: "Contain privileged-access risk and meet strict audit demands.",
    chips: ["Dual approval", "Verified audit export", "PCI-DSS · RBI · IRDAI"],
    why: "Privileged-access risk, strict audit needs (PCI-DSS, RBI and IRDAI cyber expectations).",
    points: [
      "Dual approval and N-of-M quorum for destructive commands",
      "Tamper-evident, hash-chained audit with one-click verified export",
      "Compliance evidence for PCI-DSS and India's DPDP Act",
    ],
  },
  {
    slug: "saas",
    icon: "server",
    name: "SaaS and technology companies",
    short: "SaaS & technology",
    need: "Many engineers with production access across large Linux fleets.",
    chips: ["Every command checked", "Monitor, then enforce", "SOC 2 · ISO 27001"],
    why: "Large Linux fleets, production access by many engineers, SOC 2 and ISO 27001 audits.",
    points: [
      "Intent checks on every production command, by every engineer",
      "Observe-first rollout: monitor mode, then enforcement",
      "Evidence for SOC 2 and ISO 27001 audits",
    ],
  },
  {
    slug: "critical-infrastructure",
    icon: "factory",
    name: "Critical infrastructure and defence",
    short: "Critical infrastructure",
    need: "Environments where nothing may leave the network.",
    chips: ["On-box AI", "Zero data egress", "Sovereign deployment"],
    why: "Environments where nothing may leave the network.",
    points: [
      "On-box AI with zero data egress for analysis",
      "Fully air-gapped Sovereign deployment",
      "The most catastrophic actions can never be released",
    ],
  },
];

// Fifth segment from the profile, shown as a slim card under the four primary industries.
export const regulatedNote = {
  name: "Regulated enterprises handling personal data",
  why: "Evidence for India's DPDP Act and global privacy rules.",
};
