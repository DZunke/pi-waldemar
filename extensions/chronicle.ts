import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
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

/** Falkensee chronicle cards: durable TUI-only campaign records. */
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
      const message = args.trim() || "Campaign mark placed by royal order.";
      appendChronicle(pi, {
        title: "Campaign Mark",
        message,
        tone: "info",
      });
      ctx.ui.notify("📜 Chronicle mark recorded.", "info");
    },
  });

  pi.registerCommand("chronicles", {
    description: "Summarize recent Falkensee chronicle marks",
    handler: async (_args, ctx) => {
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
        .map((entry) => `${toneIcon(entry.tone)} ${new Date(entry.timestamp).toLocaleTimeString()} — ${entry.title}: ${entry.message}`)
        .join("\n");
      ctx.ui.notify(`Recent Falkensee Chronicle\n\n${report}`, "info");
    },
  });

  pi.on("session_compact", async (event) => {
    appendChronicle(pi, {
      title: "Archive Compacted",
      message: `The chronicle was condensed by ${event.fromExtension ? "extension craft" : "standard archive protocol"}.`,
      tone: "info",
      details: {
        reason: event.reason,
        willRetry: event.willRetry,
      },
    });
  });

  pi.on("session_tree", async (event) => {
    appendChronicle(pi, {
      title: "Campaign Branch Changed",
      message: "The captain marked a change in the campaign tree.",
      tone: "info",
      details: {
        oldLeafId: event.oldLeafId,
        newLeafId: event.newLeafId,
        fromExtension: event.fromExtension,
      },
    });
  });

  pi.on("session_info_changed", async (event) => {
    appendChronicle(pi, {
      title: "Campaign Name Updated",
      message: event.name ? `The campaign now bears the name: ${event.name}` : "The campaign name was cleared.",
      tone: "info",
    });
  });
}

function appendChronicle(pi: ExtensionAPI, event: ChronicleEvent) {
  pi.appendEntry<ChronicleEntryData>("waldemar-chronicle", {
    title: event.title || "Falkensee Chronicle",
    message: event.message || "A mark was entered into the campaign record.",
    tone: event.tone || "info",
    timestamp: Date.now(),
    details: event.details,
  });
}

function normalizeChronicleEntry(data: ChronicleEntryData | undefined): ChronicleEntryData {
  return {
    title: data?.title || "Falkensee Chronicle",
    message: data?.message || "A mark was entered into the campaign record.",
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
