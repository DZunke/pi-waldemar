import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { showWaldemarInventory } from "../lib/inventory";
import { listRegisteredMcpServers } from "../lib/mcp";

/** Machine inventory for transportability checks. */
export default function packageInventoryExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-inventory", {
    description: "Inspect configured packages, extension MCP registrations, and detected skills",
    handler: async (_args, ctx) => {
      showWaldemarInventory(ctx, listRegisteredMcpServers(pi));
    },
  });
}
