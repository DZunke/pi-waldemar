import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

/** Show a concise startup note and keep the lifecycle status accurate. */
export default function startupStatusExtension(pi: ExtensionAPI) {
  pi.on("session_start", async (event, ctx) => {
    if (event.reason === "startup") {
      const projectName = path.basename(ctx.cwd) || ctx.cwd;
      ctx.ui.notify(`Waldemar is ready in ${projectName}.`, "info");

      try {
        const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");
        if (!fs.existsSync(settingsPath)) return;

        const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        if (!settings.quietStartup) {
          ctx.ui.notify("Tip: Run /waldemar-setup to apply Waldemar's recommended Pi settings.", "info");
        }
      } catch {
        // Startup hints must never interrupt the user.
      }
    }

    setWaldemarStatus(ctx, "ready");
  });

  pi.on("agent_start", async (_event, ctx) => {
    setWaldemarStatus(ctx, "working");
  });

  pi.on("agent_settled", async (event, ctx) => {
    const aborted = (event as typeof event & { aborted?: boolean }).aborted === true;
    setWaldemarStatus(ctx, aborted ? "cancelled" : "complete");
  });
}

function setWaldemarStatus(ctx: any, state: "ready" | "working" | "complete" | "cancelled") {
  const labels = {
    ready: "Ready",
    working: "Working",
    complete: "Complete",
    cancelled: "Run cancelled",
  };
  ctx.ui.setStatus("waldemar", `⚔️ Waldemar: ${labels[state]}`);
}
