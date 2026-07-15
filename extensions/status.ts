import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { WALDEMAR_SENTRY_MCP_BIN } from "../lib/waldemar";

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

  if (configuredServers.postgres) {
    lines.push("  ⚠️ postgres: stale MCP entry still present; run /waldemar-setup to remove it");
  } else {
    lines.push("  • postgres: removed from Waldemar MCP defaults");
  }

  if (!configuredServers.sentry) {
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
