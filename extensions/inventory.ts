import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { listSkillNames, WALDEMAR_SENTRY_MCP_BIN } from "../lib/waldemar";

/** Machine inventory for transportability checks. */
export default function inventoryExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-inventory", {
    description: "Inspect installed Waldemar packages, MCP servers, and skills",
    handler: async (_args, ctx) => {
      try {
        const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");
        const mcpPath = path.join(os.homedir(), ".pi/agent/mcp.json");
        const skillRoots = [
          path.join(os.homedir(), ".agents/skills"),
          path.join(os.homedir(), ".pi/agent/skills"),
        ];

        const settings = fs.existsSync(settingsPath)
          ? JSON.parse(fs.readFileSync(settingsPath, "utf-8"))
          : {};
        const mcp = fs.existsSync(mcpPath) ? JSON.parse(fs.readFileSync(mcpPath, "utf-8")) : {};
        const skills = skillRoots.flatMap((root) => listSkillNames(root));

        const mcpServers = mcp.mcpServers || {};
        const mcpReadiness = buildMcpReadiness(mcpServers);

        ctx.ui.notify(
          `⚔️ WALDEMAR INVENTORY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nPackages:\n${((settings.packages || []) as string[]).map((p) => `  • ${p}`).join("\n") || "  none"}\n\nMCP Servers:\n${Object.keys(mcpServers).map((s) => `  • ${s}`).join("\n") || "  none"}\n\nMCP Readiness:\n${mcpReadiness}\n\nInstalled Skills (${skills.length}):\n${skills.map((s) => `  • ${s}`).join("\n") || "  none"}\n\nRun /waldemar-setup to reconcile Waldemar defaults, package dependencies, external skills, and MCP servers.`,
          "info"
        );
      } catch (error) {
        ctx.ui.notify(`Inventory failed: ${String(error)}`, "error");
      }
    },
  });
}

function buildMcpReadiness(mcpServers: Record<string, unknown>): string {
  const lines: string[] = [];

  lines.push(mcpServers.codegraph ? "  • codegraph: configured" : "  ⚠️ codegraph: not configured");

  if (mcpServers.postgres) {
    lines.push("  ⚠️ postgres: stale MCP entry present; Waldemar no longer configures Postgres MCP");
  } else {
    lines.push("  • postgres: removed from Waldemar MCP defaults");
  }

  if (!mcpServers.sentry) {
    lines.push("  ⚠️ sentry: not configured; run /waldemar-setup");
  } else if (!fs.existsSync(WALDEMAR_SENTRY_MCP_BIN)) {
    lines.push(`  ⚠️ sentry: configured but binary missing at ${WALDEMAR_SENTRY_MCP_BIN}`);
  } else if (!process.env.SENTRY_AUTH_TOKEN) {
    lines.push("  ⚠️ sentry: SENTRY_AUTH_TOKEN is missing; export it before starting pi");
  } else {
    lines.push("  • sentry: configured and SENTRY_AUTH_TOKEN is present");
  }

  return lines.join("\n");
}
