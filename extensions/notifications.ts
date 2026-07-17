import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import {
  buildWaldemarNotification,
  burntToastInstallGuidance,
  describeNotificationSettings,
  extractAssistantText,
  isBurntToastAvailable,
  loadNotificationSettings,
  looksLikeQuestion,
  saveNotificationSettings,
  sendDesktopNotification,
  summarizeNotificationBody,
  type NotificationSettings,
} from "../lib/notifications";

const NOTIFICATION_MODES = ["status", "off", "questions", "settled", "all", "test", "idle"] as const;

type NotificationMode = (typeof NOTIFICATION_MODES)[number];

/** Desktop notifications for settled turns and assistant questions. */
export default function notificationsExtension(pi: ExtensionAPI) {
  let lastAssistantText = "";
  let sawAssistantReply = false;
  let lastUserActivityAt = Date.now();

  pi.registerCommand("waldemar-notifications", {
    description: "Configure Waldemar desktop notifications for questions and settled work",
    getArgumentCompletions: (prefix: string) => {
      const raw = prefix.trim().toLowerCase();
      if (raw.startsWith("idle ")) {
        return ["5", "10", "15", "30", "60"]
          .filter((value) => value.startsWith(raw.slice(5)))
          .map((value) => ({ value: `idle ${value}`, label: `idle ${value}`, description: `${value}s idle threshold` }));
      }

      return NOTIFICATION_MODES
        .filter((mode) => mode.startsWith(raw))
        .map((mode) => ({ value: mode, label: mode }));
    },
    handler: async (args, ctx) => {
      const command = parseNotificationCommand(args);
      if (!command) {
        await showNotificationStatus(ctx);
        return;
      }

      await applyNotificationCommand(ctx, command);
    },
  });

  pi.on("input", async () => {
    lastUserActivityAt = Date.now();
    return { action: "continue" as const };
  });

  pi.on("agent_start", async () => {
    lastAssistantText = "";
    sawAssistantReply = false;
  });

  pi.on("message_end", async (event) => {
    if (event.message.role !== "assistant") return;
    lastAssistantText = extractAssistantText(event.message);
    sawAssistantReply = true;
  });

  pi.on("agent_settled", async (_event, ctx) => {
    if (ctx.mode !== "tui") return;

    const settings = loadNotificationSettings();
    if (!settings.enabled) return;
    if (!sawAssistantReply || !lastAssistantText.trim()) return;
    if (Date.now() - lastUserActivityAt < settings.idleThresholdMs) return;

    const body = summarizeNotificationBody(lastAssistantText);
    if (looksLikeQuestion(lastAssistantText)) {
      if (settings.onQuestions) {
        const payload = buildWaldemarNotification("question", body);
        await sendDesktopNotification(payload.title, payload.body);
      }
      return;
    }

    if (settings.onSettled) {
      const payload = buildWaldemarNotification("settled", body);
      await sendDesktopNotification(payload.title, payload.body);
    }
  });
}

type NotificationCommand =
  | { kind: "mode"; mode: NotificationMode }
  | { kind: "idle"; seconds: number };

function parseNotificationCommand(args: string): NotificationCommand | undefined {
  const raw = args.trim().toLowerCase();
  if (!raw) return undefined;

  const idleMatch = raw.match(/^idle\s+(\d+)$/);
  if (idleMatch) {
    return { kind: "idle", seconds: Number(idleMatch[1]) };
  }

  if (["disable", "disabled", "off", "no"].includes(raw)) return { kind: "mode", mode: "off" };
  if (["enable", "enabled", "on", "all"].includes(raw)) return { kind: "mode", mode: "all" };
  if (["done", "complete", "completion", "settled"].includes(raw)) return { kind: "mode", mode: "settled" };
  if (["question", "questions", "ask"].includes(raw)) return { kind: "mode", mode: "questions" };
  if (["test", "ping"].includes(raw)) return { kind: "mode", mode: "test" };
  if (["status", "show"].includes(raw)) return { kind: "mode", mode: "status" };
  if (["idle"].includes(raw)) return { kind: "mode", mode: "idle" };

  return undefined;
}

async function applyNotificationCommand(ctx: ExtensionContext, command: NotificationCommand) {
  if (command.kind === "idle") {
    const settings = loadNotificationSettings();
    const seconds = Math.max(0, Math.min(600, Math.round(command.seconds)));
    saveAndReport(ctx, { ...settings, idleThresholdMs: seconds * 1000 }, `Idle threshold set to ${seconds}s.`);
    return;
  }

  const mode = command.mode;
  switch (mode) {
    case "status":
      await showNotificationStatus(ctx);
      return;
    case "test": {
      if (prefersWindowsToast() && !(await isBurntToastAvailable())) {
        ctx.ui.notify(`Desktop notification test failed. BurntToast PowerShell module is not available.\n\n${burntToastInstallGuidance()}`, "warning");
        return;
      }

      const payload = buildWaldemarNotification("test", "");
      const result = await sendDesktopNotification(payload.title, payload.body);
      if (result.ok) {
        ctx.ui.notify(`Desktop notification test sent via ${result.channel}.`, "info");
        return;
      }

      ctx.ui.notify(`Desktop notification test failed. ${result.detail}\n\n${result.guidance || burntToastInstallGuidance()}`, "warning");
      return;
    }
    case "off": {
      const settings = loadNotificationSettings();
      saveAndReport(ctx, { ...settings, enabled: false, onQuestions: true, onSettled: true });
      return;
    }
    case "questions": {
      const settings = loadNotificationSettings();
      saveAndReport(ctx, { ...settings, enabled: true, onQuestions: true, onSettled: false });
      return;
    }
    case "settled": {
      const settings = loadNotificationSettings();
      saveAndReport(ctx, { ...settings, enabled: true, onQuestions: false, onSettled: true });
      return;
    }
    case "all": {
      const settings = loadNotificationSettings();
      saveAndReport(ctx, { ...settings, enabled: true, onQuestions: true, onSettled: true });
      return;
    }
    case "idle":
      ctx.ui.notify("Usage: /waldemar-notifications idle <seconds>", "info");
      return;
  }
}

export async function showNotificationStatus(ctx: ExtensionContext) {
  const settings = loadNotificationSettings();
  const summary = describeNotificationSettings(settings);
  const burntToast = await isBurntToastAvailable();
  const transportLine = burntToast
    ? "Windows WSL toast transport: BurntToast available"
    : "Windows WSL toast transport: BurntToast missing";

  if (ctx.mode === "tui") {
    const selected = await ctx.ui.select(
      `Desktop notifications are currently ${summary}. Choose a mode:`,
      ["all", "questions", "settled", "off", "test", "idle 5", "idle 15", "idle 30", "idle 60"],
      { timeout: 15000 },
    );

    if (selected) {
      await applyNotificationCommand(ctx, parseNotificationCommand(selected) ?? { kind: "mode", mode: "status" });
      return;
    }
  }

  ctx.ui.notify(
    `Desktop notifications: ${summary}\n${transportLine}\n\nOrders:\n  /waldemar-notifications all\n  /waldemar-notifications questions\n  /waldemar-notifications settled\n  /waldemar-notifications off\n  /waldemar-notifications test\n  /waldemar-notifications idle <seconds>${burntToast ? "" : `\n\n${burntToastInstallGuidance()}`}`,
    burntToast ? "info" : "warning",
  );
}

function saveAndReport(ctx: ExtensionContext, settings: NotificationSettings, message?: string) {
  saveNotificationSettings(settings);
  ctx.ui.notify(message ?? `Desktop notifications ${describeNotificationSettings(settings)}.`, "info");
}

function prefersWindowsToast(): boolean {
  return Boolean(process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP || process.env.WT_SESSION);
}
