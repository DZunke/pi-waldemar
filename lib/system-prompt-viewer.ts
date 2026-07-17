import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Key, matchesKey, truncateToWidth, visibleWidth, wrapTextWithAnsi } from "@earendil-works/pi-tui";

export type PromptCapture = {
  prompt: string;
  capturedAt: Date;
  cwd: string;
  model: string;
  thinkingLevel: string;
};

export type PromptChoice = "first" | "latest";

const VISIBLE_BODY_LINES = 18;
const PAGE_SIZE = 10;

export function parseSystemPromptChoice(args: string): PromptChoice {
  const normalized = args.trim().toLowerCase();
  return normalized === "latest" ? "latest" : "first";
}

export async function showSystemPrompt(ctx: ExtensionContext, capture: PromptCapture | undefined, choice: PromptChoice) {
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
    return new SystemPromptViewer(capture, choice, theme, done, () => tui.requestRender());
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
    const border = (text: string) => this.theme.fg("borderAccent", text);
    const pad = (line: string) => truncateToWidth(line, innerW, "…", true);

    this.rewrap(bodyW);
    const maxOffset = Math.max(0, this.wrappedLines.length - VISIBLE_BODY_LINES);
    this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, maxOffset));

    const lines = [this.renderTitle(innerW, border), this.renderMetadata(innerW, pad, border), this.renderScrollInfo(maxOffset, pad, border)];
    lines.push(...this.renderBody(pad, border));
    lines.push(border("│") + pad(this.theme.fg("dim", " ↑↓ scroll │ PgUp/PgDn page │ Home/End jump │ Enter/Esc close ")) + border("│"));
    lines.push(border(`╰${"─".repeat(innerW)}╯`));

    return lines.map((line) => safeRenderedLine(line, width));
  }

  handleInput(data: string): void {
    const maxOffset = Math.max(0, this.wrappedLines.length - VISIBLE_BODY_LINES);

    if (matchesKey(data, Key.escape) || matchesKey(data, Key.enter)) {
      this.done();
      return;
    }

    this.scrollOffset = nextScrollOffset(data, this.scrollOffset, maxOffset);
    this.requestRender();
  }

  invalidate(): void {
    this.cachedWidth = 0;
    this.wrappedLines = [];
  }

  private renderTitle(innerW: number, border: (text: string) => string): string {
    const title = ` ⚔ System Prompt — ${this.choice} capture `;
    const titleContent = truncateToWidth(title, innerW, "…");
    const titleText = this.theme.fg("accent", this.theme.bold(titleContent));
    const titlePad = Math.max(0, innerW - visibleWidth(titleContent));
    return border("╭") + titleText + border(`${"─".repeat(titlePad)}╮`);
  }

  private renderMetadata(innerW: number, pad: (line: string) => string, border: (text: string) => string): string {
    const meta = [
      `${this.capture.capturedAt.toLocaleString()}`,
      this.capture.model,
      `thinking:${this.capture.thinkingLevel}`,
      `${this.wrappedLines.length} lines`,
      `${this.capture.prompt.length} chars`,
    ].join(" │ ");
    return border("│") + pad(` ${this.theme.fg("muted", meta)}`) + border("│");
  }

  private renderScrollInfo(maxOffset: number, pad: (line: string) => string, border: (text: string) => string): string {
    const remainingDown = Math.max(0, maxOffset - this.scrollOffset);
    const scroll = maxOffset > 0 ? ` ↑${this.scrollOffset} ↓${remainingDown} ` : " full prompt fits ";
    return border("│") + pad(this.theme.fg("dim", scroll)) + border("│");
  }

  private renderBody(pad: (line: string) => string, border: (text: string) => string): string[] {
    const lines: string[] = [];
    const visible = this.wrappedLines.slice(this.scrollOffset, this.scrollOffset + VISIBLE_BODY_LINES);

    for (const line of visible) {
      lines.push(border("│") + pad(` ${line}`) + border("│"));
    }
    for (let index = visible.length; index < VISIBLE_BODY_LINES; index++) {
      lines.push(border("│") + pad("") + border("│"));
    }

    return lines;
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

function nextScrollOffset(data: string, current: number, maxOffset: number): number {
  if (matchesKey(data, Key.up)) return Math.max(0, current - 1);
  if (matchesKey(data, Key.down)) return Math.min(maxOffset, current + 1);
  if (matchesKey(data, Key.pageUp)) return Math.max(0, current - PAGE_SIZE);
  if (matchesKey(data, Key.pageDown)) return Math.min(maxOffset, current + PAGE_SIZE);
  if (matchesKey(data, Key.home)) return 0;
  if (matchesKey(data, Key.end)) return maxOffset;
  return current;
}
