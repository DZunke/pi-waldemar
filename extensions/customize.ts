import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { WALDEMAR_PACKAGE_ROOT } from "../lib/waldemar";

/** Command describing Waldemar's customization points. */
export default function customizeExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-customize", {
    description: "Examine Waldemar's quarters and adjust his comportment and capabilities",
    handler: async (_args, ctx) => {
      const packagePath = WALDEMAR_PACKAGE_ROOT;
      const customizationGuide = `
⚔️  WALDEMAR CUSTOMIZATION MAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary chamber:
  /waldemar                 Open the command chamber

Durable references:
  ${packagePath}/docs/commands.md       Command roster
  ${packagePath}/docs/customization.md  Customization guide
  ${packagePath}/docs/extensions/       Extension responsibilities
  ${packagePath}/HERALDRY.md            RPG background and voice

Main alteration points:
  ${packagePath}/lib/waldemar.ts        Persona prompt and shared constants
  ${packagePath}/extensions/            Focused standing orders
  ${packagePath}/themes/                falkensee-heraldry and chronicle-keeper
  ${packagePath}/prompts/               Prompt templates
  ${packagePath}/skills/                Custom handwritten Waldemar skills
  ${packagePath}/config/external-skills.json  Reused third-party skills

Rules of the house:
  • keep extensions small and single-purpose
  • keep shared helpers in lib/
  • update docs/commands.md when commands change
  • run /reload after modifications

The full archive is in:
  ${packagePath}/README.md
      `;
      ctx.ui.notify(customizationGuide, "info");
    },
  });
}
