import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Box, Text } from "@earendil-works/pi-tui";

type ChronicleTone = "info" | "success" | "warning" | "error";

type ChronicleEntryData = {
  title: string;
  message: string;
  tone: ChronicleTone;
  timestamp: number;
  details?: Record<string, unknown>;
};

type ChronicleEvent = Partial<Omit<ChronicleEntryData, "timestamp">>;

/** Falkensee chronicle cards: deliberate TUI-only decision records. */
export default function chronicleExtension(pi: ExtensionAPI) {
  pi.registerEntryRenderer<ChronicleEntryData>("waldemar-chronicle", (entry, { expanded }, theme) => {
    const data = normalizeChronicleEntry(entry.data);
    const color = toneColor(data.tone);
    const icon = toneIcon(data.tone);

    const box = new Box(1, 1, (text) => theme.bg("customMessageBg", text));
    box.addChild(new Text(`${theme.fg(color, icon)} ${theme.fg("accent", theme.bold(data.title))}`, 0, 0));
    box.addChild(new Text(data.message, 0, 0));

    if (expanded) {
      const timestamp = new Date(data.timestamp).toLocaleString();
      const details = data.details ? `\n${JSON.stringify(data.details, null, 2)}` : "";
      box.addChild(new Text(theme.fg("dim", `Recorded: ${timestamp}${details}`), 0, 0));
    }

    return box;
  });

  pi.events.on("waldemar:chronicle", (event: ChronicleEvent) => {
    appendChronicle(pi, event);
  });

  pi.registerCommand("chronicle", {
    description: "Add a Falkensee chronicle mark to the current campaign",
    handler: async (args, ctx) => {
      const message = args.trim();
      if (!message) {
        ctx.ui.notify("Usage: /chronicle <decision or milestone to preserve>", "warning");
        return;
      }

      appendChronicle(pi, {
        title: "Decision Recorded",
        message,
        tone: "info",
      });
      ctx.ui.notify("📜 Decision recorded in the Falkensee chronicle.", "info");
    },
  });

  pi.registerCommand("chronicles", {
    description: "Summarize recent Falkensee chronicle marks",
    handler: async (_args, ctx) => {
      showRecentChronicles(ctx);
    },
  });
}

export function showRecentChronicles(ctx: ExtensionContext) {
  const entries = ctx.sessionManager
    .getBranch()
    .filter((entry) => entry.type === "custom" && entry.customType === "waldemar-chronicle")
    .slice(-8)
    .map((entry) => normalizeChronicleEntry(entry.data as ChronicleEntryData | undefined));

  if (entries.length === 0) {
    ctx.ui.notify("The Falkensee chronicle is clean parchment in this campaign.", "info");
    return;
  }

  const report = entries
    .map((entry) => [
      `${toneIcon(entry.tone)} ${new Date(entry.timestamp).toLocaleTimeString()} — ${entry.title}`,
      indent(entry.message),
    ].join("\n"))
    .join("\n\n");
  ctx.ui.notify(`Recent Falkensee Chronicle\n\n${report}`, "info");
}

function indent(message: string): string {
  return message
    .split(/\r?\n/)
    .map((line) => `  ${line}`)
    .join("\n");
}

function appendChronicle(pi: ExtensionAPI, event: ChronicleEvent) {
  pi.appendEntry<ChronicleEntryData>("waldemar-chronicle", {
    title: event.title || "Falkensee Chronicle",
    message: event.message || "A decision was entered into the campaign record.",
    tone: event.tone || "info",
    timestamp: Date.now(),
    details: event.details,
  });
}

function normalizeChronicleEntry(data: ChronicleEntryData | undefined): ChronicleEntryData {
  return {
    title: data?.title || "Falkensee Chronicle",
    message: data?.message || "A decision was entered into the campaign record.",
    tone: data?.tone || "info",
    timestamp: data?.timestamp || Date.now(),
    details: data?.details,
  };
}

function toneColor(tone: ChronicleTone): "success" | "warning" | "error" | "accent" {
  switch (tone) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "error";
    case "info":
      return "accent";
  }
}

function toneIcon(tone: ChronicleTone): string {
  switch (tone) {
    case "success":
      return "✓";
    case "warning":
      return "⚠";
    case "error":
      return "✕";
    case "info":
      return "📜";
  }
}
