import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

/** Waldemar operational status report. */
export default function statusExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-status", {
    description: "Waldemar reports his operational status",
    handler: async (_args, ctx) => {
      let sessionCount = 0;
      try {
        sessionCount = (await SessionManager.list(ctx.cwd)).length;
      } catch {
        sessionCount = 0;
      }

      const mcpStatus = getMcpStatusReport();

      const status = `
⚔️  WALDEMAR STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I, Waldemar of Falkensee, stand at attention and ready for service.

Status: Fully Operational
House: Falkensee
Office: Captain of the King's Personal Guard
Discipline: Impeccable
Ordered Line: Holding
Loyalty: Unwavering

Current Dominion: ${ctx.cwd}
Available Sessions: ${sessionCount}

MCP Readiness:
${mcpStatus}

Should you require customization of my comportment or capabilities,
consult: /waldemar-customize

Should you wish to review past campaigns:
consult: /sessions

The line is ordered. The work shall be worthy, Sire.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `;
      ctx.ui.notify(status, "info");
    },
  });
}

function getMcpStatusReport(): string {
  const lines: string[] = [];
  const mcpPath = path.join(os.homedir(), ".pi/agent/mcp.json");

  let configuredServers: Record<string, unknown> = {};
  try {
    if (fs.existsSync(mcpPath)) {
      configuredServers = JSON.parse(fs.readFileSync(mcpPath, "utf-8")).mcpServers || {};
    }
  } catch {
    lines.push("  ⚠️ ~/.pi/agent/mcp.json could not be parsed");
  }

  lines.push(configuredServers.codegraph ? "  • codegraph: configured" : "  ⚠️ codegraph: not configured; run /waldemar-setup");

  return lines.join("\n");
}
