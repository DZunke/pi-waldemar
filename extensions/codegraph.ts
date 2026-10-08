import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { applyCodegraphPromptSection, createCodegraphMcpConfig, type CodegraphMcpConfig } from "../lib/codegraph";

type PiMcpApi = ExtensionAPI & {
  registerMcpServer?: (name: string, config: CodegraphMcpConfig) => void;
};

/** Register CodeGraph with pi's built-in MCP support; connect only for indexed workspaces. */
export default function codegraphExtension(pi: ExtensionAPI) {
  const cwd = process.cwd();
  const config = createCodegraphMcpConfig(cwd);
  const registerMcpServer = (pi as PiMcpApi).registerMcpServer;

  if (!registerMcpServer) {
    throw new Error("Waldemar's CodeGraph integration requires pi's built-in MCP support (pi 0.99 or newer).");
  }

  registerMcpServer.call(pi, "codegraph", config);

  pi.on("before_agent_start", (event) => {
    const sections = (event as typeof event & {
      systemPromptOptions: { sections: Record<string, string> };
    }).systemPromptOptions.sections;

    applyCodegraphPromptSection(sections, config.enabled);
  });
}
