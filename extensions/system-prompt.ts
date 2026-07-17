import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import {
  parseSystemPromptChoice,
  showSystemPrompt,
  type PromptCapture,
  type PromptChoice,
} from "../lib/system-prompt-viewer";

let firstCapture: PromptCapture | undefined;
let latestCapture: PromptCapture | undefined;

/** Capture and inspect the effective system prompt sent into the agent turn. */
export default function systemPromptExtension(pi: ExtensionAPI) {
  pi.on("before_agent_start", async (event, ctx) => {
    const capture: PromptCapture = {
      prompt: event.systemPrompt,
      capturedAt: new Date(),
      cwd: ctx.cwd,
      model: ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "no model",
      thinkingLevel: pi.getThinkingLevel(),
    };

    if (!firstCapture) firstCapture = capture;
    latestCapture = capture;
  });

  pi.registerCommand("waldemar-system-prompt", {
    description: "Inspect Waldemar's captured system prompt",
    getArgumentCompletions: (prefix: string) => ["first", "latest"]
      .filter((value) => value.startsWith(prefix.trim()))
      .map((value) => ({ value, label: value })),
    handler: async (args, ctx) => {
      await showCapturedSystemPrompt(ctx, parseSystemPromptChoice(args));
    },
  });

  pi.registerShortcut("ctrl+shift+o", {
    description: "Inspect Waldemar's captured system prompt",
    handler: async (ctx) => {
      await showSystemPrompt(ctx, latestCapture || firstCapture, latestCapture ? "latest" : "first");
    },
  });
}

export async function showCapturedSystemPrompt(ctx: ExtensionContext, choice: PromptChoice = "first") {
  const capture = choice === "latest" ? latestCapture : firstCapture;
  await showSystemPrompt(ctx, capture, choice);
}
