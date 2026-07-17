import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Key, matchesKey, truncateToWidth, visibleWidth, wrapTextWithAnsi } from "@earendil-works/pi-tui";

type PromptCapture = {
  prompt: string;
  capturedAt: Date;
  cwd: string;
  model: string;
  thinkingLevel: string;
};

export type PromptChoice = "first" | "latest";

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
      const choice = parseSystemPromptChoice(args);
      const capture = choice === "latest" ? latestCapture : firstCapture;
      await showSystemPrompt(ctx, capture, choice);
    },
  });

  pi.registerShortcut("ctrl+shift+o", {
    description: "Inspect Waldemar's captured system prompt",
    handler: async (ctx) => {
      await showSystemPrompt(ctx, latestCapture || firstCapture, latestCapture ? "latest" : "first");
    },
  });
}

export function parseSystemPromptChoice(args: string): PromptChoice {
  const normalized = args.trim().toLowerCase();
  return normalized === "latest" ? "latest" : "first";
}

export async function showCapturedSystemPrompt(ctx: ExtensionContext, choice: PromptChoice = "first") {
  const capture = choice === "latest" ? latestCapture : firstCapture;
  await showSystemPrompt(ctx, capture, choice);
}

async function showSystemPrompt(ctx: ExtensionContext, capture: PromptCapture | undefined, choice: PromptChoice) {
  if (!capture) {
    ctx.ui.notify(
      "No system prompt has been captured yet. Send a prompt first, then run /waldemar-system-prompt.",
      "warning",
    );
    return;
  }

  if (ctx.mode !== "tui") {
    ctx.ui.notify(buildPlainReport(capture, choice), "info");
    return;
  }

  await ctx.ui.custom<void>((tui, theme, _keybindings, done) => {
    const viewer = new SystemPromptViewer(capture, choice, theme, done, () => tui.requestRender());
    return viewer;
  });
}

function buildPlainReport(capture: PromptCapture, choice: PromptChoice): string {
  return [
    `Waldemar System Prompt (${choice})`,
    `Captured: ${capture.capturedAt.toLocaleString()}`,
    `Model: ${capture.model}`,
    `Thinking: ${capture.thinkingLevel}`,
    `CWD: ${capture.cwd}`,
    "",
    capture.prompt,
  ].join("\n");
}

function safeRenderedLine(line: string, width: number): string {
  return visibleWidth(line) <= width ? line : truncateToWidth(line, width, "…", true);
}

class SystemPromptViewer {
  private scrollOffset = 0;
  private cachedWidth = 0;
  private wrappedLines: string[] = [];

  constructor(
    private readonly capture: PromptCapture,
    private readonly choice: PromptChoice,
    private readonly theme: any,
    private readonly done: () => void,
    private readonly requestRender: () => void,
  ) {}

  render(width: number): string[] {
    const innerW = Math.max(12, width - 2);
    const bodyW = Math.max(8, innerW - 2);
    const visibleBodyLines = 18;
    const border = (text: string) => this.theme.fg("borderAccent", text);
    const pad = (line: string) => truncateToWidth(line, innerW, "…", true);

    this.rewrap(bodyW);
    const maxOffset = Math.max(0, this.wrappedLines.length - visibleBodyLines);
    this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, maxOffset));

    const title = ` ⚔ System Prompt — ${this.choice} capture `;
    const titleContent = truncateToWidth(title, innerW, "…");
    const titleText = this.theme.fg("accent", this.theme.bold(titleContent));
    const titlePad = Math.max(0, innerW - visibleWidth(titleContent));
    const lines: string[] = [border("╭") + titleText + border(`${"─".repeat(titlePad)}╮`)];

    const meta = [
      `${this.capture.capturedAt.toLocaleString()}`,
      this.capture.model,
      `thinking:${this.capture.thinkingLevel}`,
      `${this.wrappedLines.length} lines`,
      `${this.capture.prompt.length} chars`,
    ].join(" │ ");
    lines.push(border("│") + pad(` ${this.theme.fg("muted", meta)}`) + border("│"));

    const remainingDown = Math.max(0, maxOffset - this.scrollOffset);
    const scroll = maxOffset > 0
      ? ` ↑${this.scrollOffset} ↓${remainingDown} `
      : " full prompt fits ";
    lines.push(border("│") + pad(this.theme.fg("dim", scroll)) + border("│"));

    const visible = this.wrappedLines.slice(this.scrollOffset, this.scrollOffset + visibleBodyLines);
    for (const line of visible) {
      lines.push(border("│") + pad(` ${line}`) + border("│"));
    }
    for (let i = visible.length; i < visibleBodyLines; i++) {
      lines.push(border("│") + pad("") + border("│"));
    }

    const help = " ↑↓ scroll │ PgUp/PgDn page │ Home/End jump │ Enter/Esc close ";
    lines.push(border("│") + pad(this.theme.fg("dim", help)) + border("│"));
    lines.push(border(`╰${"─".repeat(innerW)}╯`));
    return lines.map((line) => safeRenderedLine(line, width));
  }

  handleInput(data: string): void {
    const pageSize = 10;
    const maxOffset = Math.max(0, this.wrappedLines.length - 18);

    if (matchesKey(data, Key.escape) || matchesKey(data, Key.enter)) {
      this.done();
      return;
    }
    if (matchesKey(data, Key.up)) {
      this.scrollOffset = Math.max(0, this.scrollOffset - 1);
    } else if (matchesKey(data, Key.down)) {
      this.scrollOffset = Math.min(maxOffset, this.scrollOffset + 1);
    } else if (matchesKey(data, Key.pageUp)) {
      this.scrollOffset = Math.max(0, this.scrollOffset - pageSize);
    } else if (matchesKey(data, Key.pageDown)) {
      this.scrollOffset = Math.min(maxOffset, this.scrollOffset + pageSize);
    } else if (matchesKey(data, Key.home)) {
      this.scrollOffset = 0;
    } else if (matchesKey(data, Key.end)) {
      this.scrollOffset = maxOffset;
    }

    this.requestRender();
  }

  invalidate(): void {
    this.cachedWidth = 0;
    this.wrappedLines = [];
  }

  private rewrap(width: number) {
    if (this.cachedWidth === width && this.wrappedLines.length > 0) return;

    const result: string[] = [];
    for (const raw of this.capture.prompt.split(/\r?\n/)) {
      if (!raw.trim()) {
        result.push("");
        continue;
      }
      result.push(...wrapTextWithAnsi(raw, width));
    }

    this.cachedWidth = width;
    this.wrappedLines = result.length > 0 ? result : ["(empty system prompt)"];
  }
}
