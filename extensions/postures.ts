import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import {
  applyWaldemarPosture,
  buildPosturePrompt,
  getCurrentPosture,
  isPostureName,
  restoreWaldemarPosture,
  WALDEMAR_POSTURES,
  type PostureName,
} from "../lib/postures";

/** Guard posture commands and per-turn system prompt formation. */
export default function posturesExtension(pi: ExtensionAPI) {
  pi.registerCommand("posture", {
    description: "Set Waldemar's guard posture: watch, reconnaissance, forge, seal, siege, or council",
    getArgumentCompletions: (prefix: string) => {
      const normalized = prefix.trim().toLowerCase();
      return Object.values(WALDEMAR_POSTURES)
        .filter((posture) => posture.name.startsWith(normalized) || posture.label.toLowerCase().startsWith(normalized))
        .map((posture) => ({
          value: posture.name,
          label: posture.name,
          description: posture.description,
        }));
    },
    handler: async (args, ctx) => {
      const requested = args.trim().toLowerCase();
      if (!requested) {
        const selected = await choosePosture(ctx);
        if (!selected) return;
        applyWaldemarPosture(pi, ctx, selected, true);
        return;
      }

      if (!isPostureName(requested)) {
        ctx.ui.notify(`Unknown guard posture: ${requested}\nAvailable: ${Object.keys(WALDEMAR_POSTURES).join(", ")}`, "error");
        return;
      }

      applyWaldemarPosture(pi, ctx, requested, true);
    },
  });

  pi.registerCommand("postures", {
    description: "List Waldemar's guard postures",
    handler: async (_args, ctx) => {
      const currentPosture = getCurrentPosture();
      const lines = Object.values(WALDEMAR_POSTURES).map((posture) => {
        const marker = posture.name === currentPosture ? "⚔" : " ";
        return `${marker} ${posture.name.padEnd(15)} ${posture.description}`;
      });
      ctx.ui.notify(`Falkensee Guard Postures\n\n${lines.join("\n")}`, "info");
    },
  });

  pi.on("session_start", async (_event, ctx) => {
    applyWaldemarPosture(pi, ctx, restoreWaldemarPosture(ctx), false);
  });

  pi.on("session_tree", async (_event, ctx) => {
    applyWaldemarPosture(pi, ctx, restoreWaldemarPosture(ctx), false);
  });

  pi.on("before_agent_start", async (event) => ({
    systemPrompt: `${event.systemPrompt}\n\n${buildPosturePrompt(WALDEMAR_POSTURES[getCurrentPosture()])}`,
  }));
}

async function choosePosture(ctx: ExtensionContext): Promise<PostureName | undefined> {
  if (!ctx.hasUI) return undefined;

  const options = Object.values(WALDEMAR_POSTURES).map((posture) => `${posture.name} — ${posture.description}`);
  const selected = await ctx.ui.select("Choose Falkensee guard posture", options);
  const name = selected?.split(" ")[0];
  return isPostureName(name) ? name : undefined;
}
