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
  WALDEMAR_POSTGRES_MCP_BIN,
  WALDEMAR_SENTRY_MCP_BIN,
} from "../lib/waldemar";

/** Machine bootstrap: settings, MCP config, and external reusable skills. */
export default function setupExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-setup", {
    description: "Apply Waldemar's recommended settings to your global configuration",
    handler: async (_args, ctx) => {
      try {
        ctx.ui.notify("⚔️ Waldemar setup commenced. Reconciling this machine's arsenal...", "info");
        ctx.ui.setStatus("waldemar-setup", "⚔️ setup: preparing");

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
          compaction: {
            enabled: true,
            reserveTokens: 16384,
            keepRecentTokens: 20000,
          },
        };

        const merged = {
          ...settings,
          ...waldemarDefaults,
          compaction: {
            ...(settings.compaction || {}),
            ...waldemarDefaults.compaction,
          },
        };

        fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2));
        ctx.ui.setStatus("waldemar-setup", "⚔️ setup: settings written");

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
        ctx.ui.setStatus("waldemar-setup", "⚔️ setup: MCP configured");

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
          });

          if (result.ok) {
            skillsNotice = "\n  • external skills bootstrapped from config/external-skills.json";
          } else {
            skillsNotice = `\n  ⚠️ skill bootstrap finished with warnings/failure: ${result.summary}`;
          }
        }

        ctx.ui.setStatus("waldemar-setup", "⚔️ setup: checking MCP prerequisites");
        let mcpNotice = "";
        try {
          execFileSync("codegraph", ["--version"], { stdio: "ignore" });
        } catch {
          mcpNotice += "\n  ⚠️ codegraph binary was not found on PATH; install it before using the codegraph MCP server.";
        }
        if (!fs.existsSync(WALDEMAR_POSTGRES_MCP_BIN)) {
          mcpNotice += `\n  ⚠️ postgres MCP binary is missing at ${WALDEMAR_POSTGRES_MCP_BIN}; git/npm pi installs should resolve package dependencies automatically.`;
        }
        if (!fs.existsSync(WALDEMAR_SENTRY_MCP_BIN)) {
          mcpNotice += `\n  ⚠️ sentry MCP binary is missing at ${WALDEMAR_SENTRY_MCP_BIN}; git/npm pi installs should resolve package dependencies automatically.`;
        }
        if (!process.env.DATABASE_URL && !process.env.DB_HOST && !process.env.POSTGRES_HOST) {
          mcpNotice += "\n  ⚠️ postgres MCP is configured but needs DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME environment variables.";
        }
        if (!process.env.SENTRY_AUTH_TOKEN) {
          mcpNotice += "\n  ⚠️ SENTRY_AUTH_TOKEN is not set; sentry MCP is configured but may need authentication before use.";
        }

        ctx.ui.setStatus("waldemar-setup", "⚔️ setup: complete");
        ctx.ui.notify(
          `✅ Waldemar's settings have been applied.\n\nUpdated ~/.pi/agent/settings.json:\n  • theme: chronicle-keeper\n  • quietStartup: true\n  • defaultThinkingLevel: medium\n  • optimized compaction settings\n\nPackage dependencies:\n  • pi-mcp-adapter is declared in Waldemar package.json and should be installed by pi for git/npm package installs${dependencyNotice}\n\nUpdated ~/.pi/agent/mcp.json:\n  • codegraph MCP server via: codegraph serve --mcp\n  • postgres MCP server via bundled mcp-postgres in read-only mode\n  • sentry MCP server via bundled @sentry/mcp-server${mcpNotice}\n\nSkills:${skillsNotice || "\n  • no external skill bootstrap script found"}\n\nNext step: run /reload or restart pi if dependencies were newly installed.`,
          "info"
        );
      } catch (error) {
        ctx.ui.setStatus("waldemar-setup", "⚔️ setup: failed");
        ctx.ui.notify(`❌ Failed to apply settings: ${String(error)}`, "error");
      }
    },
  });
}

interface ProcessProgressOptions {
  command: string;
  args: string[];
  cwd: string;
  label: string;
  timeoutMs: number;
  ctx: any;
}

async function runProcessWithProgress(options: ProcessProgressOptions): Promise<{ ok: boolean; summary: string }> {
  const { command, args, cwd, label, timeoutMs, ctx } = options;
  const startedAt = Date.now();
  const tail: string[] = [];
  const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let spinnerIndex = 0;
  let currentStep = label;
  let settled = false;

  const child = spawn(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      NO_COLOR: "1",
      CI: "1",
    },
  });

  const pushOutput = (chunk: Buffer) => {
    for (const rawLine of chunk.toString("utf-8").split(/\r?\n/)) {
      const line = stripAnsi(rawLine).trim();
      if (!line) continue;

      tail.push(line);
      while (tail.length > 8) tail.shift();

      if (line.startsWith("==> ")) {
        currentStep = line.replace(/^==>\s*/, "");
        ctx.ui.setStatus("waldemar-setup", `⚔️ setup: ${currentStep}`);
      } else if (line.startsWith("WARN:")) {
        currentStep = line;
        ctx.ui.setStatus("waldemar-setup", `⚔️ setup: ${currentStep}`);
      }
    }
  };

  child.stdout?.on("data", pushOutput);
  child.stderr?.on("data", pushOutput);

  const timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    ctx.ui.setStatus("waldemar-setup", `${spinner[spinnerIndex++ % spinner.length]} ${currentStep} (${elapsed}s)`);
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
