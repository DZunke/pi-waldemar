# chamber.ts

Purpose: provide Waldemar's central TUI command chamber.

Commands:

- `/waldemar` — open the command chamber menu
- `/waldemar-arms` — display `waldemar-of-falkensee.png` as a heraldic overlay when the terminal supports images
- `/falkensee-compact` — display the Falkensee Compact
- `/waldemar-theme [theme]` — switch the current TUI session between packaged Waldemar themes

Responsibilities:

- uses custom TUI selection UI for the central command menu
- routes to posture, status, inventory, chronicle, customization, setup, theme, compact, and arms actions
- stages `/waldemar-setup` in the editor rather than executing it immediately, because setup changes global configuration
- keeps ceremonial displays on demand rather than showing large heraldry at every startup

This extension is the user's command room. Keep it navigable and restrained; it should centralize orders, not become another monolith of behaviour. The complete command roster belongs in `docs/commands.md`, not inside the chamber implementation.
