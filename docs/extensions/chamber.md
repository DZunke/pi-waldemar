# chamber.ts

Purpose: provide Waldemar's central TUI command chamber.

Commands:

- `/waldemar` — open the command chamber menu
- `/waldemar-arms` — display `waldemar-of-falkensee.png` as a heraldic overlay when the terminal supports images; otherwise show a clean file-path notice
- `/falkensee-compact` — display the Falkensee Compact
- `/waldemar-theme [theme]` — switch the current TUI session between packaged Waldemar themes

Responsibilities:

- uses custom TUI selection UI for the central command menu
- routes to posture, status, inventory, system prompt inspection, chronicle, customization, setup, theme, compact, and arms actions
- renders guard posture choices with descriptions so the user need not memorize formation purposes
- stages `/waldemar-setup` in the editor rather than executing it immediately, because setup changes global configuration
- keeps ceremonial displays on demand rather than showing large heraldry at every startup
- checks `getCapabilities().images` before opening the image overlay, so unsupported terminals do not show a transparent fallback panel
- passes an `ImageTheme` object (`{ fallbackColor }`) to the TUI `Image` component, not the full coding-agent theme

This extension is the user's command room. Keep it navigable and restrained; it should centralize orders, not become another monolith of behaviour. The complete command roster belongs in `docs/commands.md`, not inside the chamber implementation.
