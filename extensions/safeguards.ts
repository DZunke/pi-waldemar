import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

type Objection = {
  title: string;
  message: string;
  severity: "warning" | "error";
  blockWithoutUi: boolean;
};

type PathRisk = {
  label: string;
  reason: string;
  severity: "warning" | "error";
};

const DESTRUCTIVE_COMMAND_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /(^|[;&|]\s*)rm\s+[^\n]*(?:-[^\s]*r[^\s]*f|-[^\s]*f[^\s]*r)/i, reason: "recursive force removal" },
  { pattern: /(^|[;&|]\s*)rm\s+(?=[^\n]*(?:--recursive|-[^\s]*r))(?=[^\n]*(?:--force|-[^\s]*f))/i, reason: "recursive force removal" },
  { pattern: /\bsudo\b/i, reason: "privileged command" },
  { pattern: /\bgit\s+reset\s+--hard\b/i, reason: "hard git reset" },
  { pattern: /\bgit\s+clean\s+[^\n]*-[^\n]*f/i, reason: "force-cleaning untracked files" },
  { pattern: /\bchmod\s+-R\s+777\b/i, reason: "recursive world-writable permissions" },
  { pattern: /\bchown\s+-R\b/i, reason: "recursive ownership change" },
  { pattern: /\bdd\s+[^\n]*\bof=/i, reason: "raw disk/file overwrite with dd" },
  { pattern: /\bmkfs(?:\.|\s)/i, reason: "filesystem creation" },
  { pattern: /\bdrop\s+database\b/i, reason: "database destruction" },
  { pattern: /\bdocker\s+system\s+prune\b/i, reason: "docker system prune" },
  { pattern: /\bkubectl\s+delete\b/i, reason: "cluster resource deletion" },
  { pattern: /\bterraform\s+destroy\b/i, reason: "infrastructure destruction" },
];

/** Loyal-dissent safeguards for destructive commands, sensitive paths, and dirty working trees. */
export default function safeguardsExtension(pi: ExtensionAPI) {
  let dirtyRepoAcknowledged = false;
  let initialDirtySummary: string | undefined;
  let initialDirtyChecked = false;

  pi.on("session_start", async () => {
    dirtyRepoAcknowledged = false;
    initialDirtySummary = undefined;
    initialDirtyChecked = false;
  });

  pi.on("tool_call", async (event, ctx) => {
    if ((event.toolName === "edit" || event.toolName === "write") && !initialDirtyChecked) {
      initialDirtySummary = await getDirtyRepoSummary(pi, ctx.cwd);
      initialDirtyChecked = true;
      if (!initialDirtySummary) dirtyRepoAcknowledged = true;
    }

    const objection = await inspectToolCall(event.toolName, event.input as Record<string, unknown>, ctx, {
      dirtyRepoAcknowledged,
      initialDirtySummary,
    });
    if (!objection) return;

    if (!ctx.hasUI) {
      if (objection.blockWithoutUi) {
        emitSafeguardChronicle(pi, objection, false);
        return { block: true, reason: `${objection.title}: ${objection.message}` };
      }
      return;
    }

    const proceed = await ctx.ui.confirm(objection.title, `${objection.message}\n\nProceed anyway?`);
    emitSafeguardChronicle(pi, objection, proceed);

    if (!proceed) {
      return { block: true, reason: `${objection.title}: blocked by user` };
    }

    if (objection.title.includes("Dirty Dominion")) {
      dirtyRepoAcknowledged = true;
    }
  });
}

async function inspectToolCall(
  toolName: string,
  input: Record<string, unknown>,
  ctx: ExtensionContext,
  dirtyRepo: { dirtyRepoAcknowledged: boolean; initialDirtySummary?: string },
): Promise<Objection | undefined> {
  if (toolName === "bash") {
    const command = String(input.command ?? "");
    const destructive = detectDestructiveCommand(command);
    if (destructive) {
      return {
        title: "Captain's Objection: Hazardous Command",
        message: `This order resembles ${destructive.reason}.\n\nCommand:\n${command}`,
        severity: "error",
        blockWithoutUi: true,
      };
    }
  }

  if (toolName === "edit" || toolName === "write") {
    const targetPath = String(input.path ?? "");
    const pathRisk = classifyPathRisk(targetPath);
    if (pathRisk) {
      return {
        title: `Captain's Objection: ${pathRisk.label}`,
        message: `${pathRisk.reason}\n\nTarget:\n${targetPath}`,
        severity: pathRisk.severity,
        blockWithoutUi: pathRisk.severity === "error",
      };
    }

    if (!dirtyRepo.dirtyRepoAcknowledged && dirtyRepo.initialDirtySummary && ctx.hasUI) {
      return {
        title: "Captain's Objection: Dirty Dominion",
        message: `The working tree already contained uncommitted changes before this mutation. I should not let one campaign trample another without your explicit order.\n\nPre-existing changes:\n${dirtyRepo.initialDirtySummary}`,
        severity: "warning",
        blockWithoutUi: false,
      };
    }
  }

  return undefined;
}

function detectDestructiveCommand(command: string): { reason: string } | undefined {
  return DESTRUCTIVE_COMMAND_PATTERNS.find(({ pattern }) => pattern.test(command));
}

function classifyPathRisk(rawPath: string): PathRisk | undefined {
  const normalized = rawPath.replace(/^@/, "").replace(/\\/g, "/");
  const lower = normalized.toLowerCase();

  if (/(^|\/)\.env(?:\.|$)/.test(lower) || /(?:^|\/)(id_rsa|id_dsa|id_ecdsa|id_ed25519)$/.test(lower)) {
    return {
      label: "Secret-Bearing File",
      reason: "This path commonly carries credentials or machine-local secrets. Such files require explicit royal warrant.",
      severity: "error",
    };
  }

  if (/\.(pem|key|p12|pfx)$/.test(lower) || /(?:secret|credential|token|private-key)/.test(lower)) {
    return {
      label: "Sensitive Material",
      reason: "This path appears to contain credentials, tokens, private keys, or similar sensitive material.",
      severity: "error",
    };
  }

  if (/(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb|poetry\.lock|cargo\.lock|gemfile\.lock)$/.test(lower)) {
    return {
      label: "Lockfile Change",
      reason: "Lockfiles can alter dependency resolution across the realm. This may be correct, but it deserves inspection.",
      severity: "warning",
    };
  }

  if (/(^|\/)(migrations?|schema)\//.test(lower) || /(^|\/)schema\.(sql|prisma|graphql)$/.test(lower)) {
    return {
      label: "Schema or Migration Change",
      reason: "Database and schema changes can outlive the present campaign. Confirm the formation before proceeding.",
      severity: "warning",
    };
  }

  return undefined;
}

async function getDirtyRepoSummary(pi: ExtensionAPI, cwd: string): Promise<string | undefined> {
  try {
    const result = await pi.exec("git", ["-C", cwd, "status", "--short"], { timeout: 5000 });
    if (result.code !== 0) return undefined;

    const lines = result.stdout
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(0, 12);

    if (lines.length === 0) return undefined;
    return lines.join("\n");
  } catch {
    return undefined;
  }
}

function emitSafeguardChronicle(pi: ExtensionAPI, objection: Objection, proceeded: boolean) {
  pi.events.emit("waldemar:chronicle", {
    title: objection.title.replace(/^Captain's Objection: /, "Captain's Objection — "),
    message: proceeded ? `${objection.message}\n\nUser confirmed the order.` : `${objection.message}\n\nOrder blocked or declined.`,
    tone: objection.severity,
  });
}
