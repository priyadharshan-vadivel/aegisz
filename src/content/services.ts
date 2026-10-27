export const designServices = {
  summary:
    "When an off-the-shelf product doesn't fit, AegisZ designs and builds a security product to the customer's exact requirement, on the same core technology that powers IAAC.",
  engagements: [
    "Government security requirements that must be built, hosted and controlled in India.",
    "Sovereign or air-gapped deployments where no data may leave the network.",
    "Sector-specific controls for regulated industries such as banking, insurance and critical infrastructure.",
    "Integration of AegisZ enforcement and audit capabilities into a customer's existing systems.",
  ],
  process: [
    { title: "Requirement", body: "We map the threat model, compliance obligations and operating environment." },
    { title: "Design", body: "We propose the architecture and scope, reusing proven AegisZ components where possible." },
    { title: "Build and validate", body: "We develop, test and pilot in the customer's environment." },
    { title: "Deploy and support", body: "We hand over with documentation, then provide licensing, updates and support." },
  ],
};

// "What we do" comparison from the profile. Commercial model is described, never priced.
export const linesOfBusiness = {
  columns: ["Standard products", "Security design services"] as const,
  rows: [
    { label: "What it is", values: ["Ready-to-deploy AI security platforms", "Custom security products built to a specific requirement"] },
    { label: "Current offering", values: ["IAAC available now", "Requirement-led product engineering"] },
    { label: "Best for", values: ["Enterprises that need proven protection fast", "Governments and enterprises with unique, regulated or sovereign needs"] },
    { label: "Commercial model", values: ["Per-server subscription or annual sovereign licence", "Project-based design and build, then licence and support"] },
    { label: "Ownership", values: ["AegisZ IP", "Built on AegisZ technology; terms agreed per engagement"] },
  ],
};
