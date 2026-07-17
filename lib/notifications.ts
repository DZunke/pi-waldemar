import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { execFile } from "child_process";
import { Buffer } from "buffer";
import { WALDEMAR_PACKAGE_ROOT } from "./waldemar";

export type NotificationSettings = {
  enabled: boolean;
  onQuestions: boolean;
  onSettled: boolean;
};

export type NotificationDeliveryResult = {
  ok: boolean;
  channel: "burnttoast" | "terminal" | "none";
  detail: string;
  guidance?: string;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  onQuestions: true,
  onSettled: true,
};

export const WALDEMAR_NOTIFICATION_SETTINGS_PATH = path.join(os.homedir(), ".pi", "agent", "waldemar-notifications.json");

let burntToastAvailabilityPromise: Promise<boolean> | undefined;

export function loadNotificationSettings(): NotificationSettings {
  try {
    if (!fs.existsSync(WALDEMAR_NOTIFICATION_SETTINGS_PATH)) return { ...DEFAULT_NOTIFICATION_SETTINGS };

    const parsed = JSON.parse(fs.readFileSync(WALDEMAR_NOTIFICATION_SETTINGS_PATH, "utf-8")) as Partial<NotificationSettings>;
    return {
      enabled: parsed.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.enabled,
      onQuestions: parsed.onQuestions ?? DEFAULT_NOTIFICATION_SETTINGS.onQuestions,
      onSettled: parsed.onSettled ?? DEFAULT_NOTIFICATION_SETTINGS.onSettled,
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  const dir = path.dirname(WALDEMAR_NOTIFICATION_SETTINGS_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(WALDEMAR_NOTIFICATION_SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

export function describeNotificationSettings(settings: NotificationSettings): string {
  if (!settings.enabled) return "disabled";
  if (settings.onQuestions && settings.onSettled) return "enabled for questions and settled completions";
  if (settings.onQuestions) return "enabled for questions only";
  if (settings.onSettled) return "enabled for settled completions only";
  return "enabled, but no notification triggers are selected";
}

export function extractAssistantText(message: any): string {
  const content = Array.isArray(message?.content) ? message.content : [];
  return content
    .filter((part: any) => part?.type === "text" && typeof part.text === "string")
    .map((part: any) => part.text.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

export function looksLikeQuestion(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) return false;

  const lines = normalized.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const lastLine = lines[lines.length - 1] ?? normalized;

  return /\?\s*$/.test(lastLine)
    || /\b(please confirm|let me know|do you want|would you like|which option|should i|can you|could you|what should|how would you like)\b/i.test(normalized);
}

export function summarizeNotificationBody(text: string): string {
  const line = text
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find(Boolean) ?? "Ready for your next order.";

  return truncate(cleanNotificationText(line), 160);
}

export async function sendDesktopNotification(title: string, body: string): Promise<NotificationDeliveryResult> {
  const safeTitle = cleanNotificationText(title);
  const safeBody = cleanNotificationText(body);

  if (isWindowsNotificationPreferred()) {
    const windowsResult = await notifyWindows(safeTitle, safeBody);
    if (windowsResult.ok) return windowsResult;

    const terminalResult = notifyTerminal(safeTitle, safeBody);
    return {
      ...terminalResult,
      detail: `${windowsResult.detail}; terminal fallback dispatched`,
      guidance: windowsResult.guidance,
    };
  }

  return notifyTerminal(safeTitle, safeBody);
}

export function buildWaldemarNotification(kind: "question" | "settled" | "test", summary: string): { title: string; body: string } {
  const cleanSummary = cleanNotificationText(summary) || "The line is ordered. The work is worthy.";

  switch (kind) {
    case "question":
      return {
        title: "Waldemar requests orders",
        body: `House Falkensee awaits your command. ${cleanSummary}`,
      };
    case "settled":
      return {
        title: "Waldemar reports completion",
        body: `The line is ordered. The work is worthy. ${cleanSummary}`,
      };
    case "test":
      return {
        title: "Waldemar of Falkensee",
        body: "Captain of the King's Personal Guard. If this reaches your desktop, the line holds.",
      };
  }
}

export async function isBurntToastAvailable(): Promise<boolean> {
  if (!burntToastAvailabilityPromise) {
    burntToastAvailabilityPromise = runPowerShell([
      "$ErrorActionPreference = 'Stop'",
      "$module = Get-Module -ListAvailable -Name BurntToast",
      "if (-not $module) { exit 3 }",
      "Import-Module BurntToast -ErrorAction Stop",
      "$command = Get-Command New-BurntToastNotification -ErrorAction SilentlyContinue",
      "if ($null -eq $command) { exit 4 }",
      "Write-Output 'available'",
    ]).then((result) => result.ok).catch(() => false);
  }

  return burntToastAvailabilityPromise;
}

export function burntToastInstallGuidance(): string {
  return [
    "Windows toast notifications from WSL require the BurntToast PowerShell module.",
    "Open Windows PowerShell as Administrator and run:",
    "  Install-Module -Name BurntToast -Scope AllUsers",
    "Or for the current Windows user only:",
    "  Install-Module -Name BurntToast -Scope CurrentUser",
    "Then verify with:",
    "  powershell.exe -command \"New-BurntToastNotification -Text 'Waldemar test'\"",
  ].join("\n");
}

function notifyTerminal(title: string, body: string): NotificationDeliveryResult {
  if (process.env.KITTY_WINDOW_ID) {
    process.stdout.write(`\x1b]99;i=1:d=0;${title}\x1b\\`);
    process.stdout.write(`\x1b]99;i=1:p=body;${body}\x1b\\`);
    return { ok: true, channel: "terminal", detail: "kitty terminal notification dispatched" };
  }

  process.stdout.write(`\x1b]777;notify;${title};${body}\x07`);
  return { ok: true, channel: "terminal", detail: "OSC 777 terminal notification dispatched" };
}

async function notifyWindows(title: string, body: string): Promise<NotificationDeliveryResult> {
  if (!(await isBurntToastAvailable())) {
    return {
      ok: false,
      channel: "none",
      detail: "BurntToast PowerShell module is not available",
      guidance: burntToastInstallGuidance(),
    };
  }

  const imagePath = getWindowsImagePath();
  const result = await runPowerShell(buildBurntToastScript(title, body, imagePath));

  if (result.ok) {
    return { ok: true, channel: "burnttoast", detail: "BurntToast notification dispatched" };
  }

  return {
    ok: false,
    channel: "none",
    detail: `BurntToast dispatch failed: ${result.detail}`,
    guidance: burntToastInstallGuidance(),
  };
}

function buildBurntToastScript(title: string, body: string, imagePath?: string): string[] {
  const escapedTitle = escapePowerShellSingleQuoted(title);
  const escapedBody = escapePowerShellSingleQuoted(body);
  const escapedImagePath = imagePath ? escapePowerShellSingleQuoted(imagePath) : "";

  return [
    "$ErrorActionPreference = 'Stop'",
    "Import-Module BurntToast -ErrorAction Stop",
    `$title = '${escapedTitle}'`,
    `$body = '${escapedBody}'`,
    `$imagePath = '${escapedImagePath}'`,
    "$command = Get-Command New-BurntToastNotification -ErrorAction Stop",
    "if ($imagePath -and (Test-Path $imagePath) -and $command.Parameters.ContainsKey('AppLogo')) {",
    "  New-BurntToastNotification -Text $title, $body -AppLogo $imagePath | Out-Null",
    "} else {",
    "  New-BurntToastNotification -Text $title, $body | Out-Null",
    "}",
    "Write-Output 'sent'",
  ];
}

function getWindowsImagePath(): string | undefined {
  const imagePath = path.join(WALDEMAR_PACKAGE_ROOT, "waldemar-of-falkensee.png");
  if (!fs.existsSync(imagePath)) return undefined;

  if (process.env.WSL_DISTRO_NAME) {
    return `\\\\wsl.localhost\\${process.env.WSL_DISTRO_NAME}${imagePath.replace(/\//g, "\\")}`;
  }

  return imagePath;
}

async function runPowerShell(lines: string[]): Promise<{ ok: boolean; detail: string }> {
  const script = lines.join("; ");
  const encoded = Buffer.from(script, "utf16le").toString("base64");

  return new Promise((resolve) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-NonInteractive", "-EncodedCommand", encoded],
      (error, stdout, stderr) => {
        if (!error) {
          resolve({ ok: true, detail: cleanNotificationText(stdout || "ok") || "ok" });
          return;
        }

        const detail = cleanNotificationText(`${stdout || ""} ${stderr || ""}`) || error.message;
        resolve({ ok: false, detail });
      },
    );
  });
}

function escapePowerShellSingleQuoted(value: string): string {
  return value.replace(/'/g, "''");
}

function cleanNotificationText(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function isWsl(): boolean {
  return Boolean(process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP);
}

function isWindowsNotificationPreferred(): boolean {
  return Boolean(isWsl() || process.env.WT_SESSION);
}
