import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import {
  CODEGRAPH_SYSTEM_PROMPT,
  destroyCodegraphClient,
  getCodegraphClient,
  hasCodegraphIndex,
} from "../lib/codegraph";

/** Register native CodeGraph tools when a local index exists. */
export default async function codegraphExtension(pi: ExtensionAPI) {
  const cwd = process.cwd();
  if (!hasCodegraphIndex(cwd)) return;

  let client;
  try {
    client = await getCodegraphClient(cwd);
  } catch {
    return;
  }

  let tools;
  try {
    tools = await client.listTools();
  } catch {
    destroyCodegraphClient(cwd);
    return;
  }

  for (const tool of tools) {
    pi.registerTool({
      name: tool.name,
      label: tool.name.replace(/^codegraph_/, "").replace(/_/g, " "),
      description: tool.description,
      parameters: Type.Unsafe<Record<string, unknown>>(tool.inputSchema),
      execute: async (_id, params) => {
        try {
          const text = await client.callTool(tool.name, params as Record<string, unknown>);
          return { content: [{ type: "text" as const, text }], details: {} };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            content: [{ type: "text" as const, text: `codegraph error: ${message}` }],
            details: {},
          };
        }
      },
    });
  }

  pi.on("before_agent_start", async (event) => ({
    systemPrompt: event.systemPrompt.includes("# CodeGraph")
      ? event.systemPrompt
      : `${event.systemPrompt}\n\n${CODEGRAPH_SYSTEM_PROMPT}`,
  }));

  pi.on("session_shutdown", () => {
    destroyCodegraphClient(cwd);
  });
}
