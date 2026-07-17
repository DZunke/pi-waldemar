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

const NOTIFICATION_MODES = ["status", "off", "questions", "settled", "all", "test"] as const;

type NotificationMode = (typeof NOTIFICATION_MODES)[number];

/** Desktop notifications for settled turns and assistant questions. */
export default function notificationsExtension(pi: ExtensionAPI) {
  let lastAssistantText = "";

  pi.registerCommand("waldemar-notifications", {
    description: "Configure Waldemar desktop notifications for questions and settled work",
    getArgumentCompletions: (prefix: string) => NOTIFICATION_MODES
      .filter((mode) => mode.startsWith(prefix.trim().toLowerCase()))
      .map((mode) => ({ value: mode, label: mode })),
    handler: async (args, ctx) => {
      const mode = normalizeMode(args);
      if (!mode) {
        await showNotificationStatus(ctx);
        return;
      }

      await applyNotificationMode(ctx, mode);
    },
  });

  pi.on("agent_start", async () => {
    lastAssistantText = "";
  });

  pi.on("message_end", async (event) => {
    if (event.message.role !== "assistant") return;
    lastAssistantText = extractAssistantText(event.message);
  });

  pi.on("agent_settled", async (_event, ctx) => {
    if (ctx.mode !== "tui") return;

    const settings = loadNotificationSettings();
    if (!settings.enabled) return;

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

function normalizeMode(args: string): NotificationMode | undefined {
  const raw = args.trim().toLowerCase();
  if (!raw) return undefined;

  if (["disable", "disabled", "off", "no"].includes(raw)) return "off";
  if (["enable", "enabled", "on", "all"].includes(raw)) return "all";
  if (["done", "complete", "completion", "settled"].includes(raw)) return "settled";
  if (["question", "questions", "ask"].includes(raw)) return "questions";
  if (["test", "ping"].includes(raw)) return "test";
  if (["status", "show"].includes(raw)) return "status";

  return undefined;
}

async function applyNotificationMode(ctx: ExtensionContext, mode: NotificationMode) {
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
    case "off":
      saveAndReport(ctx, { enabled: false, onQuestions: true, onSettled: true });
      return;
    case "questions":
      saveAndReport(ctx, { enabled: true, onQuestions: true, onSettled: false });
      return;
    case "settled":
      saveAndReport(ctx, { enabled: true, onQuestions: false, onSettled: true });
      return;
    case "all":
      saveAndReport(ctx, { enabled: true, onQuestions: true, onSettled: true });
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
      ["all", "questions", "settled", "off", "test"],
      { timeout: 15000 },
    );

    if (selected) {
      await applyNotificationMode(ctx, selected as NotificationMode);
      return;
    }
  }

  ctx.ui.notify(
    `Desktop notifications: ${summary}\n${transportLine}\n\nOrders:\n  /waldemar-notifications all\n  /waldemar-notifications questions\n  /waldemar-notifications settled\n  /waldemar-notifications off\n  /waldemar-notifications test${burntToast ? "" : `\n\n${burntToastInstallGuidance()}`}`,
    burntToast ? "info" : "warning",
  );
}

function saveAndReport(ctx: ExtensionContext, settings: NotificationSettings) {
  saveNotificationSettings(settings);
  ctx.ui.notify(`Desktop notifications ${describeNotificationSettings(settings)}.`, "info");
}

function prefersWindowsToast(): boolean {
  return Boolean(process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP || process.env.WT_SESSION);
}
