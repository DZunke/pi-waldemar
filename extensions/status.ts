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

I, Waldemar, stand at attention and ready for service.

Status: Fully Operational
Discipline: Impeccable
Snobbishness: Perfectly calibrated
Loyalty: Unwavering

Current Dominion: ${ctx.cwd}
Available Sessions: ${sessionCount}

Should you require customization of my comportment or capabilities,
consult: /waldemar-customize

Should you wish to review past campaigns:
consult: /sessions

I remain ever vigilant and at your complete disposal, my liege.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `;
      ctx.ui.notify(status, "info");
    },
  });
}
