import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { listSkillNames } from "../lib/waldemar";

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

        ctx.ui.notify(
          `⚔️ WALDEMAR INVENTORY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nPackages:\n${((settings.packages || []) as string[]).map((p) => `  • ${p}`).join("\n") || "  none"}\n\nMCP Servers:\n${Object.keys(mcpServers).map((s) => `  • ${s}`).join("\n") || "  none"}\n\nInstalled Skills (${skills.length}):\n${skills.map((s) => `  • ${s}`).join("\n") || "  none"}\n\nCodeGraph:\n  • native CodeGraph tools activate automatically when this workspace has a .codegraph index\n\nRun /waldemar-doctor for readiness checks. Run /waldemar-setup to reconcile Waldemar defaults, package dependencies, external skills, and MCP compatibility.`,
          "info"
        );
      } catch (error) {
        ctx.ui.notify(`Inventory failed: ${String(error)}`, "error");
      }
    },
  });
}

