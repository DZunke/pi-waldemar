# Waldemar Command Reference

This is the canonical reference for commands added by the Waldemar package. Pi built-ins such as `/reload`, `/resume`, `/settings`, `/help`, and `/tree` remain available separately.

## Primary command

| Command | Purpose |
| --- | --- |
| `/waldemar` | Open Waldemar's command chamber: posture, status, inventory, chronicle, arms, compact, theme, customization, and setup orders. |

Use `/waldemar` first when you do not remember the exact order. It is the command-room door.

## Guard posture

| Command | Purpose |
| --- | --- |
| `/posture` | Choose a guard posture interactively in the TUI. |
| `/posture watch` | Balanced default service. |
| `/posture reconnaissance` | Read-first scouting; mutation tools are removed. |
| `/posture forge` | Focused implementation; editing tools are available. |
| `/posture seal` | Validation and readiness review; mutation tools are removed. |
| `/posture siege` | Deep debugging with broader tools and higher thinking. |
| `/posture council` | Architecture discussion; read-only by default. |
| `/postures` | List all available guard postures. |

Postures adjust active tools, thinking level, status display, and per-turn system prompt instructions.

## Campaign record

| Command | Purpose |
| --- | --- |
| `/chronicle [message]` | Add a durable Falkensee campaign mark to the TUI record without adding it to model context. |
| `/chronicles` | Show recent Falkensee chronicle marks. |
| `/sessions` | List recent pi sessions/campaigns in the current dominion. Use pi's built-in `/resume <path>` to continue one. |

## Chamber and heraldry

| Command | Purpose |
| --- | --- |
| `/waldemar-arms` | Display `waldemar-of-falkensee.png` as a heraldic overlay when the terminal supports images. |
| `/falkensee-compact` | Display the Falkensee Compact. |
| `/waldemar-theme [falkensee-heraldry\|chronicle-keeper]` | Switch the current TUI session's Waldemar livery. |

## Operations and setup

| Command | Purpose |
| --- | --- |
| `/waldemar-status` | Show Waldemar's operational status report. |
| `/waldemar-inventory` | Inspect installed packages, MCP servers, and skills. |
| `/waldemar-setup` | Reconcile global settings, theme, MCP config, external skills, and package dependency expectations. |
| `/waldemar-customize` | Show a concise customization map and point to the durable documentation. |

## Design policy

- Keep `/waldemar` as the interactive command hub.
- Keep `/waldemar-customize` short; durable details belong in `docs/`.
- Keep command behaviour in focused extension files, not in one monolithic extension.
- Update this file, `README.md`, and the relevant `docs/extensions/*.md` file whenever commands are added, removed, or materially changed.
