import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { showCustomizationMap } from "../lib/customize";

/** Command describing Waldemar's customization points. */
export default function customizeExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-customize", {
    description: "Examine Waldemar's quarters and adjust his comportment and capabilities",
    handler: async (_args, ctx) => {
      showCustomizationMap(ctx);
    },
  });
}
