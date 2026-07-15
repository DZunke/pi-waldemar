import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/** Command describing Waldemar's customization points. */
export default function customizeExtension(pi: ExtensionAPI) {
  pi.registerCommand("waldemar-customize", {
    description: "Examine Waldemar's quarters and adjust his comportment and capabilities",
    handler: async (_args, ctx) => {
      const packagePath = "~/.pi/waldemar";
      const customizationGuide = `
⚔️  WALDEMAR'S CUSTOMIZATION QUARTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your noble captain's demeanor and capabilities may be adjusted thusly:

📁 EXTENSIONS (Standing Orders & Commands)
   Path: ${packagePath}/extensions/
   → Keep one concern per extension file
   → presence.ts: command-chamber header, footer, title, and working indicator
   → postures.ts: tactical guard formations and posture prompt rules
   → safeguards.ts: loyal-dissent confirmations for risky operations
   → chamber.ts: central command chamber, arms, compact, and theme controls
   → chronicle.ts: durable TUI-only campaign records
   → Shared code belongs in ${packagePath}/lib/
   → Do not build another monolithic index.ts; such things are for lesser courts

🎯 CUSTOM SKILLS (Your Handwritten Tactical Expertise)
   Path: ${packagePath}/skills/
   → Create skill directories with SKILL.md for your own specialized knowledge
   → Reused third-party skills belong in config/external-skills.json

📦 EXTERNAL SKILLS (Reused Arsenal)
   Path: ${packagePath}/config/external-skills.json
   → Installed by ${packagePath}/scripts/bootstrap-skills.sh via npx skills

🔌 MCP SERVERS (External Tools)
   Path: ${packagePath}/lib/waldemar.ts
   → codegraph, postgres, and sentry are configured by /waldemar-setup
   → Details: ${packagePath}/docs/mcp.md

📜 PROMPTS (Strategic Guidance)
   Path: ${packagePath}/prompts/
   → Add custom prompt templates for specific engagements
   → Reference with /template:name

📚 DOCUMENTATION (How the Arsenal Works)
   Path: ${packagePath}/docs/
   → Extension purposes, setup flow, MCP details, and customization notes

🎨 THEMES (Heraldic Coloring)
   Path: ${packagePath}/themes/
   → falkensee-heraldry is the default command-chamber livery
   → chronicle-keeper remains available for warmer parchment styling
   → Customize the visual presentation of your command center

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After modifications, issue: /reload
This refreshes Waldemar's entire arsenal without interruption.

For detailed instructions, consult:
${packagePath}/README.md
      `;
      ctx.ui.notify(customizationGuide, "info");
    },
  });
}
