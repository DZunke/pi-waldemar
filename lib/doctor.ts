import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { execFileSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { matchesKey, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
import {
  listSkillNames,
  WALDEMAR_BOOTSTRAP_SKILLS_SCRIPT,
  WALDEMAR_PACKAGE_ROOT,
} from "./waldemar";
import { hasCodegraphIndex } from "./codegraph";
import type { RegisteredMcpServerSummary } from "./mcp";
import { getCliRequirements, isCliRequirementAvailable } from "./tooling";

export type DoctorStatus = "pass" | "warn" | "fail";

export type DoctorCheck = {
  label: string;
  status: DoctorStatus;
  detail: string;
};

type DoctorGroup = {
  label: string;
  status: DoctorStatus;
  detail: string;
  checks: DoctorCheck[];
};

export function runDoctorChecks(cwd = process.cwd(), mcpServers: RegisteredMcpServerSummary[] = []): DoctorCheck[] {
  const checks: DoctorCheck[] = [];
  const packageJsonPath = path.join(WALDEMAR_PACKAGE_ROOT, "package.json");
  const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");

  checks.push(fileCheck("package.json", packageJsonPath));
  checks.push(fileCheck("README.md", path.join(WALDEMAR_PACKAGE_ROOT, "README.md")));
  checks.push(fileCheck("LICENSE", path.join(WALDEMAR_PACKAGE_ROOT, "LICENSE")));
  checks.push(fileCheck("bootstrap skills script", WALDEMAR_BOOTSTRAP_SKILLS_SCRIPT));

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    checks.push({
      label: "pi package manifest",
      status: pkg.keywords?.includes("pi-package") && pkg.pi?.extensions && pkg.pi?.skills && pkg.pi?.prompts && pkg.pi?.themes ? "pass" : "fail",
      detail: "requires pi-package keyword and pi resource manifest",
    });
    checks.push({
      label: "repository metadata",
      status: pkg.repository?.url === "git+https://github.com/DZunke/pi-waldemar.git" ? "pass" : "warn",
      detail: pkg.repository?.url || "repository URL missing",
    });
  } catch (error) {
    checks.push({ label: "package metadata", status: "fail", detail: String(error) });
  }

  for (const theme of ["falkensee-heraldry", "falkensee-heraldry-light", "atlavium"]) {
    checks.push(fileCheck(`theme: ${theme}`, path.join(WALDEMAR_PACKAGE_ROOT, "themes", `${theme}.json`)));
  }

  for (const skill of ["ticket-writer", "ticket-validator", "epic-writer"]) {
    checks.push(fileCheck(`local skill: ${skill}`, path.join(WALDEMAR_PACKAGE_ROOT, "skills", skill, "SKILL.md")));
  }

  for (const prompt of ["write-ticket", "write-epic"]) {
    checks.push(fileCheck(`prompt template: ${prompt}`, path.join(WALDEMAR_PACKAGE_ROOT, "prompts", `${prompt}.md`)));
  }

  const codegraphIndexed = hasCodegraphIndex(cwd);
  const codegraphServer = mcpServers.find((server) => server.name === "codegraph");
  checks.push({
    label: "CodeGraph MCP registration",
    status: codegraphServer ? "pass" : "fail",
    detail: !codegraphServer
      ? "not registered; reload pi with the Waldemar extension enabled"
      : codegraphServer.config.enabled === false
        ? "registered with pi; disabled until this workspace has a .codegraph index"
        : "registered and enabled through pi's built-in MCP support",
  });
  checks.push(codegraphIndexed
    ? commandCheck("codegraph", ["--version"], "required for this workspace's .codegraph MCP server")
    : { label: "command: codegraph", status: "pass", detail: "not required until this workspace has a .codegraph index" });

  for (const tool of getCliRequirements()) {
    checks.push({
      label: `command: ${tool.command}`,
      status: isCliRequirementAvailable(tool) ? "pass" : "warn",
      detail: isCliRequirementAvailable(tool)
        ? tool.summary
        : `${tool.summary} Missing now; run /waldemar-tooling ${tool.key} for installation and setup guidance.`,
    });
  }

  try {
    const settings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, "utf-8")) : {};
    checks.push({
      label: "global theme setting",
      status: ["falkensee-heraldry", "falkensee-heraldry-light", "atlavium", "falkensee-heraldry-light/falkensee-heraldry"].includes(settings.theme) ? "pass" : "warn",
      detail: settings.theme ? `current: ${settings.theme}` : "run /waldemar-setup to apply defaults",
    });
  } catch (error) {
    checks.push({ label: "global settings", status: "fail", detail: `could not parse ${settingsPath}: ${String(error)}` });
  }

  const installedSkills = [
    ...listSkillNames(path.join(os.homedir(), ".agents/skills")),
    ...listSkillNames(path.join(os.homedir(), ".pi/agent/skills")),
  ];
  checks.push({
    label: "installed external skills",
    status: installedSkills.length > 0 ? "pass" : "warn",
    detail: installedSkills.length > 0 ? `${installedSkills.length} skills detected` : "run /waldemar-setup to bootstrap external skills",
  });


  return checks;
}

export async function showDoctorReport(ctx: ExtensionContext, checks: DoctorCheck[]) {
  const groups = buildDoctorGroups(checks);
  const pass = groups.filter((group) => group.status === "pass").length;
  const warn = groups.filter((group) => group.status === "warn").length;
  const fail = groups.filter((group) => group.status === "fail").length;

  if (ctx.mode !== "tui") {
    const report = buildPlainDoctorReport(groups, pass, warn, fail);
    console.log(report);
    ctx.ui.notify(report, fail ? "error" : warn ? "warning" : "info");
    return;
  }

  await ctx.ui.custom<void>((_tui, theme, _keybindings, done) => {
    const borderColor = (text: string) => theme.fg("borderAccent", text);
    return new DoctorPanel(groups, { pass, warn, fail }, theme, borderColor, done);
  });
}

export function buildPlainDoctorReport(groups: DoctorGroup[], pass: number, warn: number, fail: number): string {
  return [
    "⚔️ Waldemar Doctor",
    `areas ready: ${pass} | warn: ${warn} | fail: ${fail}`,
    "",
    ...groups.map((group) => `${statusIcon(group.status)} ${group.label}: ${group.detail}`),
  ].join("\n");
}

function buildDoctorGroups(checks: DoctorCheck[]): DoctorGroup[] {
  const definitions = [
    {
      label: "Package integrity",
      match: (check: DoctorCheck) => [
        "package.json",
        "README.md",
        "LICENSE",
        "bootstrap skills script",
        "pi package manifest",
        "package metadata",
        "repository metadata",
        "theme:",
        "local skill:",
        "prompt template:",
      ].some((prefix) => check.label.startsWith(prefix)),
    },
    {
      label: "Machine tooling",
      match: (check: DoctorCheck) => check.label.startsWith("command:"),
    },
    {
      label: "Local configuration",
      match: (check: DoctorCheck) => [
        "global theme setting",
        "global settings",
        "CodeGraph MCP registration",
      ].includes(check.label),
    },
    {
      label: "External skills",
      match: (check: DoctorCheck) => check.label === "installed external skills",
    },
  ];

  return definitions.map((definition) => {
    const groupedChecks = checks.filter((check) => definition.match(check));
    return {
      label: definition.label,
      status: groupStatus(groupedChecks),
      detail: summarizeGroup(groupedChecks),
      checks: groupedChecks,
    };
  }).filter((group) => group.checks.length > 0);
}

function groupStatus(checks: DoctorCheck[]): DoctorStatus {
  if (checks.some((check) => check.status === "fail")) return "fail";
  if (checks.some((check) => check.status === "warn")) return "warn";
  return "pass";
}

function summarizeGroup(checks: DoctorCheck[]): string {
  const failing = checks.filter((check) => check.status === "fail");
  if (failing.length > 0) {
    return summarizeExceptions("out of sync", failing);
  }

  const warnings = checks.filter((check) => check.status === "warn");
  if (warnings.length > 0) {
    return summarizeExceptions("needs attention", warnings);
  }

  return `ready; ${checks.length} checks in line`;
}

function summarizeExceptions(prefix: string, checks: DoctorCheck[]): string {
  const labels = checks.slice(0, 3).map((check) => check.label);
  const remainder = checks.length - labels.length;
  const suffix = remainder > 0 ? `, +${remainder} more` : "";
  return `${prefix}: ${labels.join(", ")}${suffix}`;
}

function fileCheck(label: string, targetPath: string): DoctorCheck {
  return fs.existsSync(targetPath)
    ? { label, status: "pass", detail: targetPath }
    : { label, status: "fail", detail: `missing: ${targetPath}` };
}

function commandCheck(command: string, args: string[], detail: string): DoctorCheck {
  try {
    execFileSync(command, args, { stdio: "ignore", timeout: 5000 });
    return { label: `command: ${command}`, status: "pass", detail };
  } catch {
    return { label: `command: ${command}`, status: "warn", detail: `${detail}; command not available now` };
  }
}

function statusIcon(status: DoctorStatus): string {
  switch (status) {
    case "pass": return "✓";
    case "warn": return "⚠";
    case "fail": return "✗";
  }
}

class DoctorPanel {
  constructor(
    private readonly groups: DoctorGroup[],
    private readonly summary: { pass: number; warn: number; fail: number },
    private readonly theme: any,
    private readonly borderColor: (text: string) => string,
    private readonly done: () => void,
  ) {}

  render(width: number): string[] {
    const innerW = Math.max(20, width - 2);
    const border = this.borderColor;
    const pad = (text: string) => truncateToWidth(text, innerW, "…", true);
    const lines: string[] = [];

    const title = " ⚔ Waldemar Doctor ";
    const titleContent = truncateToWidth(title, innerW, "…");
    const titlePad = Math.max(0, innerW - visibleWidth(titleContent));
    lines.push(border("╭") + this.theme.fg("accent", this.theme.bold(titleContent)) + border(`${"─".repeat(titlePad)}╮`));

    const summary = ` areas ready ${this.summary.pass}   warn ${this.summary.warn}   fail ${this.summary.fail} `;
    lines.push(border("│") + pad(this.theme.fg(this.summary.fail ? "error" : this.summary.warn ? "warning" : "success", summary)) + border("│"));

    for (const group of this.groups) {
      const color = group.status === "pass" ? "success" : group.status === "warn" ? "warning" : "error";
      const left = `${statusIcon(group.status)} ${group.label}`;
      const detailWidth = Math.max(10, innerW - visibleWidth(left) - 5);
      const detail = truncateToWidth(group.detail, detailWidth, "…");
      lines.push(border("│") + pad(` ${this.theme.fg(color, left)} ${this.theme.fg("dim", detail)}`) + border("│"));
    }

    lines.push(border("│") + pad(this.theme.fg("dim", " Enter/Esc close │ use /waldemar-tooling or /waldemar-setup when an area needs attention ")) + border("│"));
    lines.push(border(`╰${"─".repeat(innerW)}╯`));
    return lines.map((line) => visibleWidth(line) <= width ? line : truncateToWidth(line, width, "…", true));
  }

  handleInput(data: string): void {
    if (matchesKey(data, "enter") || matchesKey(data, "escape")) this.done();
  }

  invalidate(): void {}
}
