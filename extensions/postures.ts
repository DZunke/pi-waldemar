import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
type PostureName = "watch" | "reconnaissance" | "forge" | "seal" | "siege" | "council";

type GuardPosture = {
  name: PostureName;
  label: string;
  description: string;
  thinkingLevel: ThinkingLevel;
  addTools: string[];
  removeTools: string[];
  prompt: string;
};

type PostureState = {
  name: PostureName;
  timestamp: number;
};

type OriginalState = {
  tools: string[];
  thinkingLevel: ThinkingLevel;
};

const READ_TOOLS = ["read", "grep", "find", "ls"];
const MUTATION_TOOLS = ["edit", "write"];

const WALDEMAR_POSTURES: Record<PostureName, GuardPosture> = {
  watch: {
    name: "watch",
    label: "Watch",
    description: "Balanced default guard posture; restores the prior arsenal when leaving a special formation.",
    thinkingLevel: "medium",
    addTools: [],
    removeTools: [],
    prompt: "Balanced service. Inspect before changing, answer directly, and escalate only when the work requires deeper formation.",
  },
  reconnaissance: {
    name: "reconnaissance",
    label: "Reconnaissance",
    description: "Read-first scouting posture. Mutation tools are removed; understanding and risk discovery come first.",
    thinkingLevel: "high",
    addTools: [...READ_TOOLS, "bash"],
    removeTools: MUTATION_TOOLS,
    prompt: "Read-only scouting formation. Do not edit or write files. Map the field, identify risks, and propose the smallest sound plan before implementation.",
  },
  forge: {
    name: "forge",
    label: "Forge",
    description: "Implementation posture. The arsenal is open for disciplined, focused changes.",
    thinkingLevel: "medium",
    addTools: [...READ_TOOLS, "bash", ...MUTATION_TOOLS],
    removeTools: [],
    prompt: "Implementation formation. Make focused, readable changes after inspection. Prefer precise edits, run validation when practical, and keep the campaign record clear.",
  },
  seal: {
    name: "seal",
    label: "Seal",
    description: "Validation posture. Prioritize tests, checks, review, and honest readiness assessment.",
    thinkingLevel: "high",
    addTools: [...READ_TOOLS, "bash"],
    removeTools: MUTATION_TOOLS,
    prompt: "Seal formation. Do not make new edits unless explicitly ordered. Validate correctness, tests, documentation, and risks. State plainly whether the Falkensee seal can be placed.",
  },
  siege: {
    name: "siege",
    label: "Siege",
    description: "Deep debugging posture. Broad tools, higher thought, and patient breach analysis.",
    thinkingLevel: "xhigh",
    addTools: [...READ_TOOLS, "bash", ...MUTATION_TOOLS],
    removeTools: [],
    prompt: "Siege formation. Trace defects patiently through dependencies. Prefer evidence over guesses, isolate the breach, then repair in controlled stages.",
  },
  council: {
    name: "council",
    label: "Council",
    description: "Architecture and decision posture. Read-only by default; focus on trade-offs and durable design.",
    thinkingLevel: "high",
    addTools: READ_TOOLS,
    removeTools: ["bash", ...MUTATION_TOOLS],
    prompt: "Council formation. Discuss architecture, trade-offs, risks, and long-term maintenance. Avoid file changes; ask for Forge posture before implementation.",
  },
};

/** Guard posture commands and per-turn system prompt formation. */
export default function posturesExtension(pi: ExtensionAPI) {
  let currentPosture: PostureName = "watch";
  let originalState: OriginalState | undefined;

  pi.registerCommand("posture", {
    description: "Set Waldemar's guard posture: watch, reconnaissance, forge, seal, siege, or council",
    getArgumentCompletions: (prefix: string) => {
      const normalized = prefix.trim().toLowerCase();
      return Object.values(WALDEMAR_POSTURES)
        .filter((posture) => posture.name.startsWith(normalized) || posture.label.toLowerCase().startsWith(normalized))
        .map((posture) => ({
          value: posture.name,
          label: posture.name,
          description: posture.description,
        }));
    },
    handler: async (args, ctx) => {
      const requested = args.trim().toLowerCase();
      if (!requested) {
        const selected = await choosePosture(ctx);
        if (!selected) return;
        applyPosture(selected, ctx, true);
        return;
      }

      if (!isPostureName(requested)) {
        ctx.ui.notify(`Unknown guard posture: ${requested}\nAvailable: ${Object.keys(WALDEMAR_POSTURES).join(", ")}`, "error");
        return;
      }

      applyPosture(requested, ctx, true);
    },
  });

  pi.registerCommand("postures", {
    description: "List Waldemar's guard postures",
    handler: async (_args, ctx) => {
      const lines = Object.values(WALDEMAR_POSTURES).map((posture) => {
        const marker = posture.name === currentPosture ? "⚔" : " ";
        return `${marker} ${posture.name.padEnd(15)} ${posture.description}`;
      });
      ctx.ui.notify(`Falkensee Guard Postures\n\n${lines.join("\n")}`, "info");
    },
  });

  pi.on("session_start", async (_event, ctx) => {
    const restored = restorePosture(ctx);
    applyPosture(restored, ctx, false);
  });

  pi.on("session_tree", async (_event, ctx) => {
    const restored = restorePosture(ctx);
    applyPosture(restored, ctx, false);
  });

  pi.on("before_agent_start", async (event) => ({
    systemPrompt: `${event.systemPrompt}\n\n${buildPosturePrompt(WALDEMAR_POSTURES[currentPosture])}`,
  }));

  function applyPosture(name: PostureName, ctx: ExtensionContext, persist: boolean) {
    const posture = WALDEMAR_POSTURES[name];

    if (name !== "watch" && originalState === undefined) {
      originalState = {
        tools: pi.getActiveTools(),
        thinkingLevel: pi.getThinkingLevel(),
      };
    }

    if (name === "watch") {
      if (originalState) {
        pi.setActiveTools(filterKnownTools(originalState.tools, pi.getAllTools().map((tool) => tool.name)));
        pi.setThinkingLevel(originalState.thinkingLevel);
        originalState = undefined;
      } else {
        pi.setThinkingLevel(posture.thinkingLevel);
      }
    } else {
      pi.setActiveTools(resolveToolsForPosture(posture, pi.getActiveTools(), pi.getAllTools().map((tool) => tool.name)));
      pi.setThinkingLevel(posture.thinkingLevel);
    }

    currentPosture = name;
    updatePostureStatus(ctx, posture);
    announcePosture(pi, posture, persist);

    if (persist) {
      pi.appendEntry<PostureState>("waldemar-posture", {
        name,
        timestamp: Date.now(),
      });
      if (ctx.hasUI) {
        ctx.ui.notify(`⚔ Guard posture set: ${posture.label}\n${posture.description}`, "info");
      }
    }
  }
}

async function choosePosture(ctx: ExtensionContext): Promise<PostureName | undefined> {
  if (!ctx.hasUI) return undefined;

  const options = Object.values(WALDEMAR_POSTURES).map((posture) => `${posture.name} — ${posture.description}`);
  const selected = await ctx.ui.select("Choose Falkensee guard posture", options);
  const name = selected?.split(" ")[0];
  return isPostureName(name) ? name : undefined;
}

function restorePosture(ctx: ExtensionContext): PostureName {
  let restored: PostureName = "watch";

  for (const entry of ctx.sessionManager.getBranch()) {
    if (entry.type !== "custom" || entry.customType !== "waldemar-posture") continue;
    const data = entry.data as PostureState | undefined;
    if (data?.name && isPostureName(data.name)) restored = data.name;
  }

  return restored;
}

function resolveToolsForPosture(posture: GuardPosture, activeTools: string[], allTools: string[]): string[] {
  const allToolSet = new Set(allTools);
  const removed = new Set(posture.removeTools);
  const next = new Set(activeTools.filter((tool) => allToolSet.has(tool) && !removed.has(tool)));

  for (const tool of posture.addTools) {
    if (allToolSet.has(tool) && !removed.has(tool)) next.add(tool);
  }

  return [...next];
}

function filterKnownTools(tools: string[], allTools: string[]): string[] {
  const allToolSet = new Set(allTools);
  return tools.filter((tool) => allToolSet.has(tool));
}

function updatePostureStatus(ctx: ExtensionContext, posture: GuardPosture) {
  if (!ctx.hasUI) return;
  ctx.ui.setStatus("waldemar-posture", ctx.ui.theme.fg("accent", `⚔ ${posture.label}`));
}

function announcePosture(pi: ExtensionAPI, posture: GuardPosture, persist: boolean) {
  pi.events.emit("waldemar:posture", {
    name: posture.name,
    label: posture.label,
    description: posture.description,
    persist,
  });

  if (persist) {
    pi.events.emit("waldemar:chronicle", {
      title: "Guard Posture Changed",
      message: `${posture.label}: ${posture.description}`,
      tone: "info",
    });
  }
}

function buildPosturePrompt(posture: GuardPosture): string {
  return `# Current Falkensee Guard Posture: ${posture.label}\n\n${posture.prompt}\n\nIf the user's order conflicts with this posture, state the conflict plainly and propose the appropriate /posture change before proceeding.`;
}

function isPostureName(value: unknown): value is PostureName {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(WALDEMAR_POSTURES, value);
}
