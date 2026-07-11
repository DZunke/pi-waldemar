import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { WALDEMAR_PERSONA_SYSTEM_PROMPT } from "../lib/waldemar";

/** Appends Waldemar's tone and communication rules to every agent run. */
export default function personaExtension(pi: ExtensionAPI) {
  pi.on("before_agent_start", async (event) => ({
    systemPrompt: `${event.systemPrompt}\n\n${WALDEMAR_PERSONA_SYSTEM_PROMPT}`,
  }));
}
