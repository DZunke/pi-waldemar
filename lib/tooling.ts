import { execFileSync } from "child_process";

export interface CliRequirement {
  key: string;
  command: string;
  checkArgs: string[];
  summary: string;
  requiredFor: string[];
  installSteps: string[];
  setupSteps: string[];
  doctorHint: string;
}

const CLI_REQUIREMENTS: CliRequirement[] = [
  {
    key: "gh",
    command: "gh",
    checkArgs: ["skill", "install", "--help"],
    summary: "GitHub CLI with the skill installer available for GitHub hosted external skills.",
    requiredFor: ["gh-cli", "future GitHub hosted skills using the gh-skill installer"],
    installSteps: [
      "type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)",
      "sudo mkdir -p -m 755 /etc/apt/keyrings",
      "out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg",
      "cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null",
      "sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg",
      "sudo mkdir -p -m 755 /etc/apt/sources.list.d",
      "echo \"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null",
      "sudo apt update",
      "sudo apt install gh -y",
    ],
    setupSteps: [
      "Run `gh --version`.",
      "Run `gh auth login` so Waldemar's GitHub skills can reach your account when they need repository access.",
      "Run `gh skill install --help` to confirm the skill installer is present before `/waldemar-setup` tries to bootstrap `gh-cli`.",
    ],
    doctorHint: "install GitHub CLI, then run `gh auth login` and verify `gh skill install --help`",
  },
  {
    key: "sentry-cli",
    command: "sentry-cli",
    checkArgs: ["--version"],
    summary: "Sentry CLI for Sentry focused external skills and direct issue or release work.",
    requiredFor: ["sentry-cli", "future Sentry skills that shell out to the CLI"],
    installSteps: [
      "sudo apt update",
      "sudo apt install npm -y",
      "sudo npm install -g @sentry/cli",
    ],
    setupSteps: [
      "Run `sentry-cli --version`.",
      "Run `sentry-cli login` to create local credentials, or provide `SENTRY_AUTH_TOKEN` in your shell profile or CI environment.",
      "Run `sentry-cli info` to confirm authentication and default organization visibility.",
      "If you work with a specific organization or project often, set `SENTRY_ORG` and `SENTRY_PROJECT` in your shell profile to reduce repeated flags.",
    ],
    doctorHint: "install `@sentry/cli`, then run `sentry-cli login` and `sentry-cli info`",
  },
];

export function getCliRequirements(): CliRequirement[] {
  return CLI_REQUIREMENTS;
}

export function getCliRequirement(keyOrCommand: string): CliRequirement | undefined {
  const value = keyOrCommand.trim().toLowerCase();
  return CLI_REQUIREMENTS.find((tool) => tool.key === value || tool.command.toLowerCase() === value);
}

export function isCliRequirementAvailable(tool: CliRequirement): boolean {
  try {
    execFileSync(tool.command, tool.checkArgs, { stdio: "ignore", timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export function buildCliRequirementGuide(tool: CliRequirement): string {
  return [
    `Tool: ${tool.key}`,
    `Purpose: ${tool.summary}`,
    `Used by: ${tool.requiredFor.join(", ")}`,
    "",
    "Install on Debian or Ubuntu:",
    ...tool.installSteps.map((step, index) => `  ${index + 1}. ${step}`),
    "",
    "Finish setup:",
    ...tool.setupSteps.map((step, index) => `  ${index + 1}. ${step}`),
    "",
    `Verification command: ${tool.command} ${tool.checkArgs.join(" ")}`,
  ].join("\n");
}

export function buildCliToolingReport(selected?: string): string {
  if (selected) {
    const tool = getCliRequirement(selected);
    if (!tool) {
      const known = CLI_REQUIREMENTS.map((item) => item.key).join(", ");
      return `Unknown Waldemar CLI tool. Known tools: ${known}`;
    }

    if (isCliRequirementAvailable(tool)) {
      return [
        "⚔️ Waldemar Tooling Guide",
        "",
        `Tool: ${tool.key}`,
        "Status: already available on this machine.",
        `Verification command: ${tool.command} ${tool.checkArgs.join(" ")}`,
        "No installation orders are needed.",
      ].join("\n");
    }

    return [
      "⚔️ Waldemar Tooling Guide",
      "",
      buildCliRequirementGuide(tool),
      "",
      "Next step: run /waldemar-setup after the required CLI is installed and verified.",
    ].join("\n");
  }

  const missing = CLI_REQUIREMENTS.filter((tool) => !isCliRequirementAvailable(tool));
  if (missing.length === 0) {
    return [
      "⚔️ Waldemar Tooling Guide",
      "",
      "All registered CLI tools are already available on this machine.",
      "No installation orders are needed.",
    ].join("\n");
  }

  return [
    "⚔️ Waldemar Tooling Guide",
    "",
    ...missing.flatMap((tool, index) => index === 0 ? [buildCliRequirementGuide(tool)] : ["", buildCliRequirementGuide(tool)]),
    "",
    "Next step: run /waldemar-setup after the required CLIs are installed and verified.",
  ].join("\n");
}

export function buildMissingCliRequirementsSummary(): string {
  const missing = CLI_REQUIREMENTS.filter((tool) => !isCliRequirementAvailable(tool));
  if (missing.length === 0) {
    return "  • all registered CLI tools are available";
  }

  return missing.map((tool) => {
    return `  • ${tool.command}: ${tool.doctorHint}. Full Debian or Ubuntu guide: /waldemar-tooling ${tool.key}`;
  }).join("\n");
}