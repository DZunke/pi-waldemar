import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { execFileSync, spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
  WALDEMAR_BOOTSTRAP_SKILLS_SCRIPT,
  WALDEMAR_MCP_EXTENSION_DIR,
  WALDEMAR_MCP_SERVERS,
  WALDEMAR_PACKAGE_ROOT,
} from "../lib/waldemar";

/** Machine bootstrap: settings, CodeGraph readiness, optional MCP compatibility, and external reusable skills. */
export default function setupExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-setup", {
    description: "Apply Waldemar's recommended settings to your global configuration",
    handler: async (_args, ctx) => {
      try {
        ctx.ui.notify("⚔️ Waldemar setup commenced. Reconciling this machine's arsenal...", "info");
        setSetupStatus(pi, ctx, "⚔️ setup: preparing");

        const settingsPath = path.join(os.homedir(), ".pi/agent/settings.json");
        const settingsDir = path.dirname(settingsPath);

        if (!fs.existsSync(settingsDir)) {
          fs.mkdirSync(settingsDir, { recursive: true });
        }

        let settings: any = {};
        if (fs.existsSync(settingsPath)) {
          try {
            settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
          } catch {
            ctx.ui.notify("⚠️  Could not parse existing settings.json. Starting fresh.", "warning");
          }
        }

        const waldemarDefaults = {
          quietStartup: true,
          defaultThinkingLevel: "medium",
          hideThinkingBlock: false,
          theme: "falkensee-heraldry",
          editorPaddingX: 1,
          outputPad: 1,
          autocompleteMaxVisible: 8,
          doubleEscapeAction: "tree",
          treeFilterMode: "default",
          collapseChangelog: true,
          enableSkillCommands: true,
          compaction: {
            enabled: true,
            reserveTokens: 16384,
            keepRecentTokens: 20000,
          },
          branchSummary: {
            reserveTokens: 16384,
            skipPrompt: false,
          },
          retry: {
            enabled: true,
            maxRetries: 3,
            baseDelayMs: 2000,
            provider: {
              maxRetries: 0,
              maxRetryDelayMs: 60000,
            },
          },
          terminal: {
            showImages: true,
            imageWidthCells: 60,
          },
          images: {
            autoResize: true,
            blockImages: false,
          },
        };

        const merged = {
          ...settings,
          ...waldemarDefaults,
          compaction: {
            ...(settings.compaction || {}),
            ...waldemarDefaults.compaction,
          },
          branchSummary: {
            ...(settings.branchSummary || {}),
            ...waldemarDefaults.branchSummary,
          },
          retry: {
            ...(settings.retry || {}),
            ...waldemarDefaults.retry,
            provider: {
              ...(settings.retry?.provider || {}),
              ...waldemarDefaults.retry.provider,
            },
          },
          terminal: {
            ...(settings.terminal || {}),
            ...waldemarDefaults.terminal,
          },
          images: {
            ...(settings.images || {}),
            ...waldemarDefaults.images,
          },
        };

        fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2));
        setSetupStatus(pi, ctx, "⚔️ setup: settings written");

        const mcpPath = path.join(os.homedir(), ".pi/agent/mcp.json");
        let mcpConfig: any = {};
        if (fs.existsSync(mcpPath)) {
          try {
            mcpConfig = JSON.parse(fs.readFileSync(mcpPath, "utf-8"));
          } catch {
            ctx.ui.notify("⚠️  Could not parse existing mcp.json. Recreating MCP configuration.", "warning");
          }
        }
        mcpConfig.mcpServers = {
          ...(mcpConfig.mcpServers || {}),
          ...WALDEMAR_MCP_SERVERS,
        };
        fs.writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2));
        setSetupStatus(pi, ctx, "⚔️ setup: MCP configured");

        const dependencyNotice = fs.existsSync(WALDEMAR_MCP_EXTENSION_DIR)
          ? ""
          : `\n  ⚠️ pi-mcp-adapter dependency is missing at ${WALDEMAR_MCP_EXTENSION_DIR}. If this is a local-path install, run npm install in the Waldemar package once; git/npm pi installs should resolve dependencies automatically.`;

        let skillsNotice = "";
        if (fs.existsSync(WALDEMAR_BOOTSTRAP_SKILLS_SCRIPT)) {
          ctx.ui.notify("📦 Bootstrapping external skills from config/external-skills.json. This may take a few minutes on a fresh machine.", "info");
          const result = await runProcessWithProgress({
            command: "bash",
            args: [WALDEMAR_BOOTSTRAP_SKILLS_SCRIPT],
            cwd: WALDEMAR_PACKAGE_ROOT,
            label: "skills bootstrap",
            timeoutMs: 600_000,
            ctx,
            onStatusChange: () => pi.events.emit("waldemar:footer-render", {}),
          });

          if (result.ok) {
            skillsNotice = "\n  • external skills bootstrapped from config/external-skills.json";
          } else {
            skillsNotice = `\n  ⚠️ skill bootstrap finished with warnings/failure: ${result.summary}`;
          }
        }

        setSetupStatus(pi, ctx, "⚔️ setup: checking CodeGraph readiness");
        let codegraphNotice = "";
        try {
          execFileSync("codegraph", ["--version"], { stdio: "ignore" });
        } catch {
          codegraphNotice += "\n  ⚠️ codegraph binary was not found on PATH; install it before using the native CodeGraph extension or the MCP compatibility server.";
        }

        setSetupStatus(pi, ctx, "⚔️ setup: complete");
        ctx.ui.notify(
          `✅ Waldemar's settings have been applied.\n\nUpdated ~/.pi/agent/settings.json:\n  • theme: falkensee-heraldry\n  • quietStartup: true\n  • defaultThinkingLevel: medium\n  • command-chamber display defaults\n  • compaction, retry, image, and branch-summary defaults\n\nCodeGraph:\n  • native CodeGraph tools activate automatically when this workspace has a .codegraph index\n  • codegraph binary checked on PATH${codegraphNotice}\n\nPackage dependencies:\n  • pi-mcp-adapter is still declared for general MCP compatibility in pi installs${dependencyNotice}\n\nUpdated ~/.pi/agent/mcp.json:\n  • codegraph MCP compatibility entry via: codegraph serve --mcp\n\nSkills:${skillsNotice || "\n  • no external skill bootstrap script found"}\n\nNext step: run /reload or restart pi if dependencies were newly installed.`,
          "info"
        );
      } catch (error) {
        setSetupStatus(pi, ctx, "⚔️ setup: failed");
        ctx.ui.notify(`❌ Failed to apply settings: ${String(error)}`, "error");
      }
    },
  });
}

function setSetupStatus(pi: ExtensionAPI, ctx: any, text: string) {
  ctx.ui.setStatus("waldemar-setup", text);
  pi.events.emit("waldemar:footer-render", {});
}

interface ProcessProgressOptions {
  command: string;
  args: string[];
  cwd: string;
  label: string;
  timeoutMs: number;
  ctx: any;
  onStatusChange?: () => void;
}

async function runProcessWithProgress(options: ProcessProgressOptions): Promise<{ ok: boolean; summary: string }> {
  const { command, args, cwd, label, timeoutMs, ctx, onStatusChange } = options;
  const startedAt = Date.now();
  const tail: string[] = [];
  const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let spinnerIndex = 0;
  let currentStep = label;
  let settled = false;
  let lastNotifyAt = 0;
  let lastNotifiedStep = "";

  const child = spawn(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      NO_COLOR: "1",
      CI: "1",
    },
  });

  const publishProgress = (message: string, forceNotify = false) => {
    currentStep = message;
    ctx.ui.setStatus("waldemar-setup", `⚔️ setup: ${currentStep}`);
    onStatusChange?.();

    const now = Date.now();
    const shouldNotify = forceNotify || (message !== lastNotifiedStep && now - lastNotifyAt > 8_000);
    if (shouldNotify) {
      lastNotifyAt = now;
      lastNotifiedStep = message;
      ctx.ui.notify(`📦 ${message}`, "info");
    }
  };

  const pushOutput = (chunk: Buffer) => {
    for (const rawLine of chunk.toString("utf-8").split(/\r?\n/)) {
      const line = stripAnsi(rawLine).trim();
      if (!line) continue;

      tail.push(line);
      while (tail.length > 8) tail.shift();

      if (line.startsWith("==> ")) {
        publishProgress(line.replace(/^==>\s*/, ""), true);
      } else if (line.startsWith("WARN:")) {
        publishProgress(line, true);
      }
    }
  };

  child.stdout?.on("data", pushOutput);
  child.stderr?.on("data", pushOutput);

  const timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    ctx.ui.setStatus("waldemar-setup", `${spinner[spinnerIndex++ % spinner.length]} ${currentStep} (${elapsed}s)`);
    onStatusChange?.();

    const now = Date.now();
    if (now - lastNotifyAt > 30_000) {
      lastNotifyAt = now;
      lastNotifiedStep = currentStep;
      ctx.ui.notify(`📦 Still working: ${currentStep} (${elapsed}s elapsed)`, "info");
    }
  }, 1_000);

  const timeout = setTimeout(() => {
    if (!settled) {
      child.kill("SIGTERM");
    }
  }, timeoutMs);

  return await new Promise((resolve) => {
    child.on("error", (error) => {
      settled = true;
      clearInterval(timer);
      clearTimeout(timeout);
      resolve({ ok: false, summary: error.message });
    });

    child.on("close", (code, signal) => {
      settled = true;
      clearInterval(timer);
      clearTimeout(timeout);

      if (code === 0) {
        ctx.ui.setStatus("waldemar-setup", `⚔️ setup: ${label} complete`);
        onStatusChange?.();
        resolve({ ok: true, summary: "complete" });
        return;
      }

      const reason = signal ? `terminated by ${signal}` : `exit code ${code}`;
      const details = tail.length > 0 ? `${reason}; ${tail.join(" | ")}` : reason;
      resolve({ ok: false, summary: details });
    });
  });
}

function stripAnsi(value: string): string {
  return value.replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
}
