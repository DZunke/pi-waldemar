import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export interface RegisteredMcpServerSummary {
  name: string;
  config: { enabled?: boolean };
  extensionPath?: string;
}

type PiMcpRegistryApi = ExtensionAPI & {
  getMcpServers?: () => RegisteredMcpServerSummary[];
};

/** Return MCP servers registered by extensions, without treating file config as extension-owned. */
export function listRegisteredMcpServers(pi: ExtensionAPI): RegisteredMcpServerSummary[] {
  const getMcpServers = (pi as PiMcpRegistryApi).getMcpServers;
  return typeof getMcpServers === "function" ? getMcpServers.call(pi) : [];
}
