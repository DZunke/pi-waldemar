import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";

/** Commands for inspecting previous campaign/session history. */
export default function sessionsExtension(pi: ExtensionAPI) {
  pi.registerCommand("sessions", {
    description: "Consult with Waldemar about previous campaigns (sessions)",
    handler: async (_args, ctx) => {
      try {
        const sessions = await SessionManager.list(ctx.cwd);
        if (sessions.length === 0) {
          ctx.ui.notify("No prior campaigns recorded in this dominion.", "info");
          return;
        }

        const displayNames = sessions.slice(0, 10).map((s, i) => `[${i + 1}] ${s.file}`);
        ctx.ui.notify(`Past Campaigns of Distinction:\n\n${displayNames.join("\n")}`, "info");
        ctx.ui.notify("Use: /resume <path> to return to previous engagements", "info");
      } catch (error) {
        ctx.ui.notify(`Waldemar encountered a minor impediment: ${String(error)}`, "error");
      }
    },
  });
}
