import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { SessionInfo } from "../lib/waldemar";

type StatusMood = {
  emoji: string;
  ready: string;
  working: string;
  settled: string;
};

const WALDEMAR_STATUS_MOODS: StatusMood[] = [
  {
    emoji: "⚔️",
    ready: "Waldemar: Blade polished, awaiting your command",
    working: "Waldemar: Executing your orders with precision",
    settled: "Waldemar: Guard restored, awaiting inspection",
  },
  {
    emoji: "🛡️",
    ready: "Waldemar: Shield raised over the dominion",
    working: "Waldemar: Holding the line against mediocrity",
    settled: "Waldemar: Perimeter secure, my liege",
  },
  {
    emoji: "👑",
    ready: "Waldemar: Courtly vigilance established",
    working: "Waldemar: Conducting a most refined engagement",
    settled: "Waldemar: The court is once again orderly",
  },
  {
    emoji: "🦅",
    ready: "Waldemar: Falcon-eyed and watching the codebase",
    working: "Waldemar: Reconnaissance in motion",
    settled: "Waldemar: Reconnaissance complete",
  },
  {
    emoji: "🏰",
    ready: "Waldemar: Castle watch is properly manned",
    working: "Waldemar: Fortifying the architecture",
    settled: "Waldemar: Battlements inspected and sound",
  },
  {
    emoji: "🎖️",
    ready: "Waldemar: Standards high, patience selective",
    working: "Waldemar: Applying disciplined excellence",
    settled: "Waldemar: Excellence restored to acceptable levels",
  },
  {
    emoji: "📜",
    ready: "Waldemar: Quill ready for your next decree",
    working: "Waldemar: Drafting the campaign record",
    settled: "Waldemar: Chronicle updated, naturally",
  },
];

/** Startup greeting, setup hint, and footer status handling. */
export default function startupExtension(pi: ExtensionAPI) {
  pi.on("session_start", async (event, ctx) => {
    if (event.reason !== "startup") return;

    ctx.ui.notify("⚔️ Waldemar reports for duty. At your service, my liege.", "info");

    let sessionHistory: SessionInfo[] = [];
    try {
      sessionHistory = await SessionManager.list(ctx.cwd);
    } catch {
      sessionHistory = [];
    }

    displayNobleGreeting(ctx, sessionHistory);

    try {
      const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");
      if (!fs.existsSync(settingsPath)) return;

      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      if (!settings.quietStartup) {
        ctx.ui.notify(
          "💡 Tip: Run /waldemar-setup to apply Waldemar's recommended settings (quietStartup, theme, thinking level, etc.)",
          "info"
        );
      }
    } catch {
      // Startup hints must never interrupt the user.
    }
  });

  pi.on("session_start", async (_event, ctx) => {
    setWaldemarStatus(ctx, "ready");
  });

  pi.on("agent_start", async (_event, ctx) => {
    setWaldemarStatus(ctx, "working");
  });

  pi.on("agent_end", async (_event, ctx) => {
    setWaldemarStatus(ctx, "settled");
  });
}

function setWaldemarStatus(ctx: any, state: keyof StatusMood) {
  const mood = randomStatusMood();
  ctx.ui.setStatus("waldemar", `${mood.emoji} ${mood[state]}`);
}

function randomStatusMood(): StatusMood {
  return WALDEMAR_STATUS_MOODS[Math.floor(Math.random() * WALDEMAR_STATUS_MOODS.length)];
}

function displayNobleGreeting(ctx: any, sessionHistory: SessionInfo[]) {
  const greeting = `
┌─ Waldemar ──────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Hi! I'm Waldemar, your AI coding assistant. I can help you:                │
│                                                                              │
│  📝  Read and understand your code                                          │
│  ✏️   Write and edit files                                                   │
│  🔨  Execute commands and shell scripts                                     │
│  🔍  Search and grep through projects                                       │
│  🎯  Solve coding problems                                                  │
│  💭  Reason about complex architecture                                      │
│  🧠  Think deeply when needed (Shift+Tab to adjust level)                   │
│                                                                              │
│  Just ask me anything about your code or project!                           │
│  Type /hotkeys to see keyboard shortcuts.                                   │
│  Type /help or /settings to configure Pi.                                   │
│                                                                              │
│  I'm powered by advanced AI models—pick your favorite with Ctrl+L.         │
│  Switch between models anytime with Ctrl+P.                                │
│                                                                              │
│  Recent Campaigns: ${sessionHistory.length} recorded in this domain          │
│  Commands: /sessions, /waldemar-customize, /waldemar-status                  │
│            /waldemar-inventory                                               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
  `;

  ctx.ui.notify(greeting, "info");
}
