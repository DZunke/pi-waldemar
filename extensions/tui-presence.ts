import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
import * as path from "path";

type PresencePhase = "ready" | "working" | "complete" | "cancelled";

const WALDEMAR_WORKING_MESSAGES = [
  "Inspecting the code...",
  "Tracing the change...",
  "Checking the details...",
  "Preparing a precise fix...",
  "Validating the result...",
  "Reviewing for regressions...",
];

/** Add Waldemar's identity and useful runtime details to the Pi TUI. */
export default function tuiPresenceExtension(pi: ExtensionAPI) {
  let phase: PresencePhase = "ready";
  let modelLabel = "no model";
  let thinkingLabel = "medium";
  let renderFooter: (() => void) | undefined;

  const requestFooterRender = () => renderFooter?.();

  pi.events.on("waldemar:footer-render", () => {
    requestFooterRender();
  });

  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    phase = "ready";
    modelLabel = ctx.model?.id || "no model";
    thinkingLabel = pi.getThinkingLevel();

    ctx.ui.setTitle(`Waldemar — ${path.basename(ctx.cwd) || ctx.cwd}`);
    installHeader(ctx);
    installFooter(ctx, () => ({ phase, modelLabel, thinkingLabel }), (render) => {
      renderFooter = render;
    });
    installWorkingIndicator(ctx);
    ctx.ui.setStatus("waldemar-presence", ctx.ui.theme.fg("dim", "Waldemar UI"));
  });

  pi.on("model_select", async (event) => {
    modelLabel = event.model.id;
    requestFooterRender();
  });

  pi.on("thinking_level_select", async (event) => {
    thinkingLabel = event.level;
    requestFooterRender();
  });

  pi.on("agent_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;
    phase = "working";
    ctx.ui.setWorkingMessage(randomWorkingMessage());
    requestFooterRender();
  });

  pi.on("agent_settled", async (event, ctx) => {
    if (!ctx.hasUI) return;
    const aborted = (event as typeof event & { aborted?: boolean }).aborted === true;
    phase = aborted ? "cancelled" : "complete";
    ctx.ui.setWorkingMessage();
    requestFooterRender();
  });
}

function installHeader(ctx: ExtensionContext) {
  if (ctx.mode !== "tui") return;

  ctx.ui.setHeader((_tui, theme) => ({
    render(width: number): string[] {
      const title = theme.fg("accent", theme.bold("⚔ Waldemar of Falkensee"));
      const office = theme.fg("muted", "Personal coding agent · Falkensee");
      const watchwords = theme.fg("dim", "Discipline · Precision · Noble Purpose");
      const seal = theme.fg("borderAccent", "The line is ordered. The work shall be worthy.");

      return [
        centerLine(title, width),
        centerLine(office, width),
        centerLine(watchwords, width),
        centerLine(seal, width),
      ];
    },
    invalidate() {},
  }));
}

function installFooter(
  ctx: ExtensionContext,
  getState: () => { phase: PresencePhase; modelLabel: string; thinkingLabel: string },
  onRenderReady: (render: () => void) => void,
) {
  if (ctx.mode !== "tui") return;

  ctx.ui.setFooter((tui, theme, footerData) => {
    const rerender = () => tui.requestRender();
    onRenderReady(rerender);
    const unsubscribeBranch = footerData.onBranchChange(rerender);

    return {
      dispose: unsubscribeBranch,
      invalidate() {},
      render(width: number): string[] {
        const state = getState();
        const branch = footerData.getGitBranch() || "no branch";
        const statuses = Array.from(footerData.getExtensionStatuses().entries())
          .filter(([key, value]) => Boolean(value) && key !== "waldemar-presence")
          .map(([, value]) => value)
          .slice(0, 2)
          .join(" │ ");

        const phaseText = phaseLabel(state.phase);
        const left = theme.fg("accent", `⚔ ${phaseText}`);
        const right = theme.fg("dim", `${state.modelLabel} │ ${branch} │ thought:${state.thinkingLabel}`);
        const middle = statuses ? theme.fg("dim", ` ${statuses} `) : "";

        const used = visibleWidth(left) + visibleWidth(middle) + visibleWidth(right);
        if (used + 2 <= width) {
          const leftPad = Math.max(1, Math.floor((width - used) / 2));
          const rightPad = Math.max(1, width - used - leftPad);
          return [truncateToWidth(left + " ".repeat(leftPad) + middle + " ".repeat(rightPad) + right, width)];
        }

        if (middle) {
          const leftAndStatus = `${left} ${middle}`;
          if (visibleWidth(leftAndStatus) <= width) return [truncateToWidth(leftAndStatus, width)];
          return [truncateToWidth(middle.trim(), width)];
        }

        return [truncateToWidth(`${left} ${right}`, width)];
      },
    };
  });
}

function installWorkingIndicator(ctx: ExtensionContext) {
  const theme = ctx.ui.theme;
  ctx.ui.setWorkingIndicator({
    frames: [
      theme.fg("dim", "◇"),
      theme.fg("accent", "◆"),
      theme.fg("borderAccent", "◆"),
      theme.fg("accent", "◆"),
    ],
    intervalMs: 140,
  });
}

function centerLine(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - visibleWidth(text)) / 2));
  return truncateToWidth(`${" ".repeat(padding)}${text}`, width);
}

function phaseLabel(phase: PresencePhase): string {
  switch (phase) {
    case "working":
      return "Working";
    case "complete":
      return "Complete";
    case "cancelled":
      return "Cancelled";
    case "ready":
      return "Ready";
  }
}

function randomWorkingMessage(): string {
  return WALDEMAR_WORKING_MESSAGES[Math.floor(Math.random() * WALDEMAR_WORKING_MESSAGES.length)];
}
