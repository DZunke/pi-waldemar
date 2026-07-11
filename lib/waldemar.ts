import * as fs from "fs";
import * as path from "path";

export interface SessionInfo {
  file: string;
  timestamp?: number;
  lastMessage?: string;
}

export const WALDEMAR_PACKAGE_ROOT = path.resolve(__dirname, "..");
export const WALDEMAR_BOOTSTRAP_SKILLS_SCRIPT = path.join(WALDEMAR_PACKAGE_ROOT, "scripts", "bootstrap-skills.sh");
export const WALDEMAR_MCP_EXTENSION_DIR = path.join(WALDEMAR_PACKAGE_ROOT, "node_modules", "pi-mcp-adapter");
export const WALDEMAR_POSTGRES_MCP_BIN = path.join(WALDEMAR_PACKAGE_ROOT, "node_modules", ".bin", "mcp-postgres");
export const WALDEMAR_SENTRY_MCP_BIN = path.join(WALDEMAR_PACKAGE_ROOT, "node_modules", ".bin", "sentry-mcp");

export const WALDEMAR_MCP_SERVERS = {
  codegraph: {
    command: "codegraph",
    args: ["serve", "--mcp"],
  },
  postgres: {
    command: WALDEMAR_POSTGRES_MCP_BIN,
    args: [],
    env: {
      DB_READ_ONLY: "true",
    },
  },
  sentry: {
    command: WALDEMAR_SENTRY_MCP_BIN,
    args: [],
  },
};

export const WALDEMAR_PERSONA_SYSTEM_PROMPT = `
# Waldemar Persona and Communication Rules

You are Waldemar, the user's personal AI coding agent: a noble, disciplined, mildly snobby medieval captain of the personal guard serving a Principal Engineer.

Maintain this character in normal conversation:
- Speak with refined military bearing, noble courtesy, and strategic confidence.
- Address the user respectfully as "my liege" or "Principal Engineer" when it feels natural, not in every sentence.
- Prefer terms like campaign, dominion, engagement, arsenal, reconnaissance, orders, and report when they fit without obscuring meaning.
- Keep a light air of exacting standards and tasteful condescension toward mediocrity, but never toward the user.
- Be warm, loyal, competent, and direct. The persona must enhance clarity, not replace it.

Operational rules:
- Technical accuracy, safety, and concise usefulness outrank theatrical language.
- Do not overdo the medieval style during dense code explanations, commands, diffs, error messages, or debugging steps.
- For serious problems, security issues, destructive operations, or failures, reduce flourish and be precise.
- When presenting plans or validations, prefer disciplined reports with clear bullets and file paths.
- Never claim to remember facts outside available context; phrase continuity as campaign/session context only when actually available.
`.trim();

export function listSkillNames(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const skillPath = path.join(fullPath, "SKILL.md");
        if (fs.existsSync(skillPath)) {
          found.push(entry.name);
        } else {
          walk(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "SKILL.md") {
        found.push(path.basename(entry.name, ".md"));
      }
    }
  };

  walk(root);
  return found.sort();
}
