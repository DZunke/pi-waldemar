import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { showWaldemarInventory } from "../lib/inventory";

/** Machine inventory for transportability checks. */
export default function inventoryExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-inventory", {
    description: "Inspect installed Waldemar packages, MCP servers, and skills",
    handler: async (_args, ctx) => {
      showWaldemarInventory(ctx);
    },
  });
}

