import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";

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

For package and machine readiness checks:
consult: /waldemar-doctor

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
