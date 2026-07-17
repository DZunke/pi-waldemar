# chamber.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)


Purpose: provide Waldemar's central TUI command chamber.

Commands:

- `/waldemar` — open the command chamber menu
- `/waldemar-arms` — display `waldemar-of-falkensee.png` as a heraldic overlay when the terminal supports images; otherwise show a clean file-path notice
- `/falkensee-compact` — display the Falkensee Compact
- `/waldemar-theme [theme]` — switch the current TUI session between packaged Waldemar themes

Responsibilities:

- uses custom TUI selection UI for the central command menu
- routes to posture, inventory, doctor, tooling guidance, system prompt inspection, desktop notifications, chronicle, customization, setup, theme, compact, and arms actions through local handlers, not staged agent prompts
- renders guard posture choices with descriptions so the user need not memorize formation purposes
- stages `/waldemar-setup` in the editor rather than executing it immediately, because setup changes global configuration
- must not call `sendUserMessage` for chamber menu actions; selecting an action must not create an agent turn or model cost
- keeps ceremonial displays on demand rather than showing large heraldry at every startup
- checks `getCapabilities().images` before opening the image overlay, so unsupported terminals do not show a transparent fallback panel
- passes an `ImageTheme` object (`{ fallbackColor }`) to the TUI `Image` component, not the full coding-agent theme

This extension is the user's command room. Keep it navigable and restrained; it should centralize orders, not become another monolith of behaviour. The complete command roster belongs in `docs/commands.md`, not inside the chamber implementation.
