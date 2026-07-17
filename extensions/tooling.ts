import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { buildCliToolingReport, getCliRequirements } from "../lib/tooling";

/** Explicit installation and setup guidance for machine local CLI tools used by Waldemar skills. */
export default function toolingExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-tooling", {
    description: "Show install and setup guidance for CLI tools used by Waldemar skills",
    getArgumentCompletions: (prefix: string) => getCliRequirements()
      .map((tool) => tool.key)
      .filter((name) => name.startsWith(prefix.trim()))
      .map((name) => ({ value: name, label: name })),
    handler: async (args, ctx) => {
      const selected = args.trim() || undefined;
      ctx.ui.notify(buildCliToolingReport(selected), "info");
    },
  });
}