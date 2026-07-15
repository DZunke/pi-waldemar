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

type StartupReport = {
  title: string;
  lines: string[];
};

const WALDEMAR_STARTUP_REPORTS: StartupReport[] = [
  {
    title: "Morning Rapport",
    lines: [
      "The watch has changed without incident.",
      "The archives are quiet, which is suspicious but acceptable.",
      "I await the first lawful order of the day.",
    ],
  },
  {
    title: "Field Report",
    lines: [
      "The dominion has been sighted and the standards raised.",
      "No assumption has yet been admitted without papers.",
      "Point me at the breach, Sire, and I shall form the line.",
    ],
  },
  {
    title: "Captain's Log",
    lines: [
      "House Falkensee stands in service, not ceremony.",
      "Quills sharpened; absent tests remain under suspicion.",
      "Give the order. I will inspect before I strike.",
    ],
  },
  {
    title: "Gatehouse Report",
    lines: [
      "The gates answer to command and the signal fires are trimmed.",
      "Entropy has been seen loitering near the dependencies.",
      "A disciplined engagement should discourage it.",
    ],
  },
  {
    title: "Falkensee Watch",
    lines: [
      "Falcon sight is upon the codefield.",
      "Speed remains welcome; avoidable ruin remains beneath contempt.",
      "The line is ordered. The work shall be worthy.",
    ],
  },
];

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
    settled: "Waldemar: Perimeter secure, Sire",
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
  const report = randomStartupReport();
  const dominionName = path.basename(ctx.cwd) || ctx.cwd;
  const campaignWord = sessionHistory.length === 1 ? "campaign" : "campaigns";

  const greeting = formatWaldemarBox(report.title, [
    "Waldemar of Falkensee reports.",
    "Captain of the King's Personal Guard. Warden of the Ordered Line.",
    "",
    ...report.lines,
    "",
    `Dominion: ${dominionName}`,
    `Chronicle: ${sessionHistory.length} recorded ${campaignWord} in this field`,
    "Command chamber: /waldemar",
    "Direct orders: /posture  /chronicle  /sessions  /waldemar-status",
  ]);

  ctx.ui.notify(greeting, "info");
}

function randomStartupReport(): StartupReport {
  return WALDEMAR_STARTUP_REPORTS[Math.floor(Math.random() * WALDEMAR_STARTUP_REPORTS.length)];
}

function formatWaldemarBox(title: string, lines: string[]) {
  const width = 78;
  const innerWidth = width - 4;
  const heading = ` Waldemar — ${title} `;
  const leftRule = Math.max(1, Math.floor((innerWidth - heading.length) / 2));
  const rightRule = Math.max(1, innerWidth - heading.length - leftRule);
  const top = `┌${"─".repeat(leftRule)}${heading}${"─".repeat(rightRule)}┐`;
  const body = lines.flatMap((line) => wrapBoxLine(line, innerWidth - 1)).map((line) => `│ ${line.padEnd(innerWidth - 1)}│`);
  const bottom = `└${"─".repeat(innerWidth)}┘`;
  return [top, ...body, bottom].join("\n");
}

function wrapBoxLine(line: string, width: number): string[] {
  if (line.length <= width) return [line];

  const wrapped: string[] = [];
  let remaining = line;
  while (remaining.length > width) {
    const breakAt = remaining.lastIndexOf(" ", width);
    const sliceAt = breakAt > 0 ? breakAt : width;
    wrapped.push(remaining.slice(0, sliceAt));
    remaining = remaining.slice(sliceAt).trimStart();
  }
  wrapped.push(remaining);
  return wrapped;
}
