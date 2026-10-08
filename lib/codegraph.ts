import * as fs from "fs";
import * as path from "path";

export interface CodegraphMcpConfig {
  command: "codegraph";
  args: string[];
  cwd: string;
  enabled: boolean;
  exposure: "codemode";
  description: string;
}

export const CODEGRAPH_SYSTEM_PROMPT = `
# CodeGraph

When this workspace has a local .codegraph index, Waldemar registers the CodeGraph MCP server with pi. Use Pi's tool_search to find a focused CodeGraph tool, or codemode to combine several queries.

Recommended selection:
- Start with codegraph_explore for code comprehension, design tracing, control-flow questions, or change scouting.
- Use codegraph_search to locate a symbol by name.
- Use codegraph_node to inspect one symbol's body, especially when its name is overloaded or ambiguous.
- Use codegraph_callers or codegraph_callees to inspect incoming or outgoing call relationships.
- Use codegraph_impact to estimate what a change could affect.
- Use codegraph_files or codegraph_status for directory and index-level checks.

Prefer CodeGraph when structure matters. Fall back to ordinary file reads for raw text, comments, logs, or verification after edits because the index may lag.
`.trim();

export function applyCodegraphPromptSection(sections: Record<string, string>, enabled: boolean): void {
  if (enabled) sections.codegraph = CODEGRAPH_SYSTEM_PROMPT;
  else delete sections.codegraph;
}

export function hasCodegraphIndex(cwd: string): boolean {
  return fs.existsSync(path.join(cwd, ".codegraph"));
}

export function createCodegraphMcpConfig(cwd: string): CodegraphMcpConfig {
  return {
    command: "codegraph",
    args: ["serve", "--mcp"],
    cwd,
    enabled: hasCodegraphIndex(cwd),
    exposure: "codemode",
    description: "Symbol-aware CodeGraph search, exploration, and impact analysis for this workspace.",
  };
}
