import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import {
  applyCompactToolSet,
  buildToolCatalogResult,
  buildToolListResult,
  enableCatalogTools,
  listAllTools,
  searchToolCatalog,
  TOOL_CATALOG_TOOL_NAME,
  type ToolCatalogQuery,
} from "../lib/tool-catalog";

/** Compact tool exposure plus searchable activation for non-core tools. */
export default function toolCatalogExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "waldemar_list_tools",
    label: "Waldemar List Tools",
    description: "Return a complete overview of installed tools and whether each tool is currently active.",
    promptSnippet: "List every installed tool when a full tool overview is needed.",
    parameters: Type.Object({}),
    async execute() {
      const tools = listAllTools(pi.getAllTools());
      return {
        content: [{ type: "text" as const, text: buildToolListResult(tools, pi.getActiveTools()) }],
        details: { tools, active: pi.getActiveTools() },
      };
    },
  });

  pi.registerTool({
    name: TOOL_CATALOG_TOOL_NAME,
    label: "Waldemar Tool Catalog",
    description: "Search installed non-core tools and enable selected tools for the next agent step.",
    promptSnippet: "Search and enable non-core installed tools by name, source, or purpose.",
    promptGuidelines: [
      "Use waldemar_list_tools when you need a complete overview of every installed tool rather than a specific search.",
      "Use waldemar_tool_catalog before assuming a specialized installed tool is active.",
      "Use core tools directly for normal file inspection, shell commands, and edits; use waldemar_tool_catalog for optional MCP, package, or integration tools.",
    ],
    parameters: Type.Object({
      query: Type.Optional(Type.String({ description: "Tool name, source, or purpose to search for." })),
      enable: Type.Optional(Type.Array(Type.String(), { description: "Exact tool names to activate after search." })),
      limit: Type.Optional(Type.Number({ description: "Maximum matching tools to return." })),
      listAll: Type.Optional(Type.Boolean({ description: "Return every matching non-core tool instead of applying the limit." })),
    }),
    async execute(_toolCallId, params: ToolCatalogQuery) {
      const limit = params.limit ?? 12;
      const enabled = enableCatalogTools(pi, params.enable);
      const matches = searchToolCatalog(pi.getAllTools(), params.query, limit, params.listAll ?? false);

      return {
        content: [{ type: "text" as const, text: buildToolCatalogResult(matches, enabled) }],
        details: { matches, enabled },
      };
    },
  });

  pi.on("session_start", async () => {
    applyCompactToolSet(pi);
  });

  pi.on("resources_discover", async () => {
    applyCompactToolSet(pi);
  });
}
