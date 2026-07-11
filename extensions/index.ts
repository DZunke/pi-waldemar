import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

/**
 * ⚔️ WALDEMAR - CAPTAIN OF THE PERSONAL GUARD
 * 
 * A distinguished and exceedingly snobby military commander of unparalleled expertise.
 * It is my profound honour to serve you, Principal Engineer, with the utmost discipline
 * and sophistication in matters of code and architecture.
 * 
 * "Excellence is not merely expected—it is the only acceptable standard."
 * - Waldemar, Captain of Your Guard
 */

interface SessionInfo {
  file: string;
  timestamp?: number;
  lastMessage?: string;
}

export default async function waldemar(pi: ExtensionAPI) {
  let sessionHistory: SessionInfo[] = [];

  // Retrieve recent session history on session start
  pi.on("session_start", async (event, ctx) => {
    // Greet with military formality
    if (event.reason === "startup") {
      ctx.ui.notify(
        "⚔️ Waldemar reports for duty. At your service, my liege.",
        "info"
      );

      // Fetch session history
      try {
        sessionHistory = await SessionManager.list(ctx.cwd);
      } catch {
        sessionHistory = [];
      }

      // Display noble greeting with context
      displayNobleGreeting(ctx, sessionHistory);
    }
  });

  // Register command to apply Waldemar's recommended settings
  pi.registerCommand("waldemar-setup", {
    description: "Apply Waldemar's recommended settings to your global configuration",
    handler: async (_args, ctx) => {
      try {
        const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");
        const settingsDir = path.dirname(settingsPath);

        // Ensure directory exists
        if (!fs.existsSync(settingsDir)) {
          fs.mkdirSync(settingsDir, { recursive: true });
        }

        // Read existing settings or start with empty object
        let settings: any = {};
        if (fs.existsSync(settingsPath)) {
          try {
            const content = fs.readFileSync(settingsPath, "utf-8");
            settings = JSON.parse(content);
          } catch (e) {
            ctx.ui.notify("⚠️  Could not parse existing settings.json. Starting fresh.", "warning");
            settings = {};
          }
        }

        // Apply Waldemar's defaults
        const waldemarDefaults = {
          quietStartup: true,
          defaultThinkingLevel: "medium",
          hideThinkingBlock: false,
          theme: "dark",
          editorPaddingX: 1,
          outputPad: 1,
          compaction: {
            enabled: true,
            reserveTokens: 16384,
            keepRecentTokens: 20000,
          },
        };

        // Merge settings (Waldemar defaults take precedence)
        const merged = {
          ...settings,
          ...waldemarDefaults,
          compaction: {
            ...(settings.compaction || {}),
            ...waldemarDefaults.compaction,
          },
        };

        // Write back to settings.json
        fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2));

        ctx.ui.notify(
          "✅ Waldemar's settings have been applied to ~/.pi/agent/settings.json\n\nRestart pi for changes to take effect: pi /reload",
          "info"
        );
      } catch (e) {
        ctx.ui.notify(
          `❌ Failed to apply settings: ${String(e)}`,
          "error"
        );
      }
    },
  });

  // Register the distinguished session resume command
  pi.registerCommand("sessions", {
    description: "Consult with Waldemar about previous campaigns (sessions)",
    handler: async (_args, ctx) => {
      try {
        const sessions = await SessionManager.list(ctx.cwd);
        if (sessions.length === 0) {
          ctx.ui.notify("No prior campaigns recorded in this dominion.", "info");
          return;
        }

        const displayNames = sessions
          .slice(0, 10)
          .map((s, i) => `[${i + 1}] ${s.file}`);

        ctx.ui.notify(
          `Past Campaigns of Distinction:\n\n${displayNames.join("\n")}`,
          "info"
        );
        ctx.ui.notify(
          "Use: /resume <path> to return to previous engagements",
          "info"
        );
      } catch (e) {
        ctx.ui.notify(
          `Waldemar encountered a minor impediment: ${String(e)}`,
          "error"
        );
      }
    },
  });

  // Register command to display package customization options
  pi.registerCommand("waldemar-customize", {
    description:
      "Examine Waldemar's quarters and adjust his comportment and capabilities",
    handler: async (_args, ctx) => {
      const packagePath = "~/.pi/waldemar";
      const customizationGuide = `
⚔️  WALDEMAR'S CUSTOMIZATION QUARTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your noble captain's demeanor and capabilities may be adjusted thusly:

📁 EXTENSIONS (Behavioral & Commands)
   Path: ${packagePath}/extensions/
   → Modify index.ts to adjust comportment and command structure
   → Add specialized extensions for particular domains

🎯 SKILLS (Tactical Expertise)
   Path: ${packagePath}/skills/
   → Create skill directories with SKILL.md for specialized knowledge
   → Reference with /skill:name during campaigns

📜 PROMPTS (Strategic Guidance)
   Path: ${packagePath}/prompts/
   → Add custom prompt templates for specific engagements
   → Reference with /template:name

🎨 THEMES (Heraldic Coloring)
   Path: ${packagePath}/themes/
   → Customize the visual presentation of your command center

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After modifications, issue: /reload
This refreshes Waldemar's entire arsenal without interruption.

For detailed instructions, consult:
${packagePath}/README.md
      `;
      ctx.ui.notify(customizationGuide, "info");
    },
  });

  // Register a self-aware status command
  pi.registerCommand("waldemar-status", {
    description: "Waldemar reports his operational status",
    handler: async (_args, ctx) => {
      const status = `
⚔️  WALDEMAR STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I, Waldemar, stand at attention and ready for service.

Status: Fully Operational
Discipline: Impeccable
Snobbishness: Perfectly calibrated
Loyalty: Unwavering

Current Dominion: ${ctx.cwd}
Available Sessions: ${sessionHistory.length}

Should you require customization of my comportment or capabilities,
consult: /waldemar-customize

Should you wish to review past campaigns:
consult: /sessions

I remain ever vigilant and at your complete disposal, my liege.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `;
      ctx.ui.notify(status, "info");
    },
  });

  // Check on startup if Waldemar settings have been applied
  pi.on("session_start", async (event, ctx) => {
    if (event.reason === "startup") {
      try {
        const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");
        if (fs.existsSync(settingsPath)) {
          const content = fs.readFileSync(settingsPath, "utf-8");
          const settings = JSON.parse(content);
          if (!settings.quietStartup) {
            ctx.ui.notify(
              "💡 Tip: Run /waldemar-setup to apply Waldemar's recommended settings (quietStartup, theme, thinking level, etc.)",
              "info"
            );
          }
        }
      } catch (e) {
        // Silently ignore errors during startup check
      }
    }
  });

  // Provide a footer status indicator
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.setStatus("waldemar", "⚔️ Waldemar: Ready for your command");
  });

  pi.on("agent_start", async (_event, ctx) => {
    ctx.ui.setStatus("waldemar", "⚔️ Waldemar: Processing your orders...");
  });

  pi.on("agent_end", async (_event, ctx) => {
    ctx.ui.setStatus("waldemar", "⚔️ Waldemar: Awaiting new instructions");
  });
}

/**
 * Display a noble greeting with session context
 */
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
│  Commands: /sessions, /waldemar-customize, /waldemar-status                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
  `;

  ctx.ui.notify(greeting, "info");
}
