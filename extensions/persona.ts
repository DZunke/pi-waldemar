import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { WALDEMAR_PERSONA_SYSTEM_PROMPT } from "../lib/waldemar";

/** Contribute Waldemar's identity and communication doctrine as a structured prompt section. */
export default function personaExtension(pi: ExtensionAPI) {
  pi.on("before_agent_start", (event) => {
    const sections = (event as typeof event & {
      systemPromptOptions: { sections: Record<string, string> };
    }).systemPromptOptions.sections;
    sections.waldemar_persona = WALDEMAR_PERSONA_SYSTEM_PROMPT;
  });
}
