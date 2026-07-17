import type { ExtensionAPI, ToolInfo } from "@earendil-works/pi-coding-agent";

export const TOOL_CATALOG_TOOL_NAME = "waldemar_tool_catalog";

const CORE_TOOL_NAMES = new Set([
  "read",
  "bash",
  "edit",
  "write",
  "grep",
  "find",
  "ls",
  "mcp",
  "waldemar_skill_catalog",
  "waldemar_list_tools",
  "waldemar_list_skills",
  TOOL_CATALOG_TOOL_NAME,
]);

type ToolCatalogQuery = {
  query?: string;
  enable?: string[];
  limit?: number;
  listAll?: boolean;
};

type ToolCatalogEntry = {
  name: string;
  description: string;
  source: string;
};

export function applyCompactToolSet(pi: ExtensionAPI): void {
  const available = new Set(pi.getAllTools().map((tool) => tool.name));
  const active = [...CORE_TOOL_NAMES].filter((name) => available.has(name));
  pi.setActiveTools(active);
}

export function searchToolCatalog(tools: ToolInfo[], query = "", limit = 12, listAll = false): ToolCatalogEntry[] {
  const normalizedQuery = normalize(query);
  const entries = listAllTools(tools);

  const matches = normalizedQuery
    ? entries.filter((entry) => matchesQuery(entry, normalizedQuery))
    : entries.filter((entry) => !CORE_TOOL_NAMES.has(entry.name));

  if (listAll) return matches;
  return matches.slice(0, Math.max(1, limit));
}

export function listAllTools(tools: ToolInfo[]): ToolCatalogEntry[] {
  return tools
    .map(toCatalogEntry)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function buildToolListResult(tools: ToolCatalogEntry[], activeToolNames: string[]): string {
  const active = new Set(activeToolNames);
  return [
    "Waldemar Complete Tool Registry",
    "",
    ...tools.map((tool) => `${active.has(tool.name) ? "●" : "○"} ${tool.name} (${tool.source}): ${tool.description || "No description provided."}`),
    "",
    "● active now · ○ installed but inactive",
    "Enable inactive specialist tools with waldemar_tool_catalog enable: [\"tool_name\"].",
  ].join("\n");
}

export function enableCatalogTools(pi: ExtensionAPI, requestedNames: string[] | undefined): string[] {
  if (!requestedNames || requestedNames.length === 0) return [];

  const available = new Set(pi.getAllTools().map((tool) => tool.name));
  const safeRequested = requestedNames.filter((name) => available.has(name));
  const nextActive = new Set([...pi.getActiveTools(), ...safeRequested, ...CORE_TOOL_NAMES].filter((name) => available.has(name)));

  pi.setActiveTools([...nextActive]);
  return safeRequested;
}

export function buildToolCatalogResult(matches: ToolCatalogEntry[], enabled: string[]): string {
  const enabledSection = enabled.length > 0
    ? [`Enabled for the next agent step: ${enabled.join(", ")}`, ""]
    : [];
  const matchSection = matches.length > 0
    ? matches.map((tool) => `- ${tool.name} (${tool.source}): ${tool.description || "No description provided."}`)
    : ["No matching non-core tools found."];

  return [
    "Waldemar Tool Catalog",
    "",
    ...enabledSection,
    "Matching tools:",
    ...matchSection,
    "",
    "To see the full installed non-core tool list, call waldemar_tool_catalog with listAll: true.",
    "To use a listed tool, call waldemar_tool_catalog again with enable: [\"tool_name\"].",
  ].join("\n");
}

function toCatalogEntry(tool: ToolInfo): ToolCatalogEntry {
  return {
    name: tool.name,
    description: tool.description || "",
    source: tool.sourceInfo?.source || tool.sourceInfo?.path || "unknown",
  };
}

function matchesQuery(entry: ToolCatalogEntry, normalizedQuery: string): boolean {
  return [entry.name, entry.description, entry.source].some((value) => normalize(value).includes(normalizedQuery));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export type { ToolCatalogQuery };
