import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { RegisteredMcpServerSummary } from "./mcp";
import { listSkillNames, WALDEMAR_PACKAGE_ROOT } from "./waldemar";

export function showWaldemarInventory(ctx: ExtensionContext, registeredMcpServers: RegisteredMcpServerSummary[] = []) {
  try {
    const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");
    const globalMcpPath = path.join(os.homedir(), ".pi/agent/mcp.json");
    const projectMcpPath = path.join(ctx.cwd, ".pi/mcp.json");
    const userSkillRoots = [
      path.join(os.homedir(), ".agents/skills"),
      path.join(os.homedir(), ".pi/agent/skills"),
    ];

    const settings = readJson(settingsPath);
    const globalMcp = readJson(globalMcpPath);
    const projectMcp = readJson(projectMcpPath);
    const configuredPackages = formatPackages(settings.packages);
    const globalServers = Object.keys(globalMcp.mcpServers || {});
    const projectServers = Object.keys(projectMcp.mcpServers || {});
    const userSkills = userSkillRoots.flatMap((root) => listSkillNames(root));
    const packagedSkills = listSkillNames(path.join(WALDEMAR_PACKAGE_ROOT, "skills"));
    const codegraph = registeredMcpServers.find((server) => server.name === "codegraph");

    const codegraphStatus = codegraph
      ? "  • registered with Pi's built-in MCP support" + (codegraph.config.enabled === false
        ? "; enabled when this workspace has a .codegraph index"
        : " and enabled for this workspace")
      : "  • registration unavailable; reload Pi with Waldemar enabled";

    const report = [
      "⚔️ WALDEMAR INVENTORY",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "Packages (global settings):",
      formatBulletList(configuredPackages),
      "",
      "MCP servers configured globally:",
      formatBulletList(globalServers),
      "MCP servers configured for this workspace:",
      formatBulletList(projectServers),
      "MCP servers registered by extensions:",
      formatBulletList(registeredMcpServers.map((server) => {
        return server.name + (server.config.enabled === false ? " (disabled)" : "");
      })),
      "",
      "Packaged skills (" + packagedSkills.length + "):",
      formatBulletList(packagedSkills),
      "User skills detected (" + userSkills.length + "):",
      formatBulletList(userSkills),
      "",
      "CodeGraph:",
      codegraphStatus,
      "  • use /mcp for effective connection and authentication status",
      "",
      "Pi's native tool_search, codemode, and /skill:<name> handle on-demand tool and skill discovery.",
      "Run /waldemar-doctor for readiness checks. Run /waldemar-setup to reconcile Waldemar settings and external skills.",
    ].join("\n");

    ctx.ui.notify(report, "info");
  } catch (error) {
    ctx.ui.notify(`Inventory failed: ${String(error)}`, "error");
  }
}

function formatBulletList(entries: string[]): string {
  return entries.length ? entries.map((entry) => "  • " + entry).join("\n") : "  none";
}

function readJson(filePath: string): Record<string, any> {
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : {};
}

function formatPackages(packages: unknown): string[] {
  if (!Array.isArray(packages)) return [];
  return packages.map((entry) => {
    if (typeof entry === "string") return entry;
    if (entry && typeof entry === "object") {
      const source = "source" in entry && typeof entry.source === "string" ? entry.source : undefined;
      return source || JSON.stringify(entry);
    }
    return String(entry);
  });
}
