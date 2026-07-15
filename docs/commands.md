# Waldemar Command Reference

This is the canonical reference for commands added by the Waldemar package. Pi built-ins such as `/reload`, `/resume`, `/settings`, `/help`, `/tree`, `/mcp`, and `/mcp-auth` remain available separately.

## Primary command

| Command | Purpose |
| --- | --- |
| `/waldemar` | Open Waldemar's command chamber: posture, inventory, doctor, system prompt, chronicle, arms, compact, theme, customization, and setup orders. |

Use `/waldemar` first when you do not remember the exact order. It is the command-room door.

## Guard posture

Postures adjust active tools, thinking level, footer/status display, and per-turn system prompt instructions.

| Command | Thinking | Tool behavior | Purpose |
| --- | --- | --- | --- |
| `/posture` | — | — | Choose a guard posture interactively in the TUI. |
| `/posture watch` | `medium` | Restores the prior arsenal after special formations. | Balanced default service. Inspect before changing and escalate only when needed. |
| `/posture reconnaissance` | `high` | Adds read/search/bash tools and removes `edit`/`write`. | Read-first scouting, risk discovery, and plan formation before implementation. |
| `/posture forge` | `medium` | Enables read/search/bash/edit/write. | Focused implementation with precise edits and practical validation. |
| `/posture seal` | `high` | Adds read/search/bash and removes `edit`/`write`. | Validation, tests, documentation review, and readiness judgement. |
| `/posture siege` | `xhigh` | Enables read/search/bash/edit/write. | Deep debugging and patient breach analysis through dependencies. |
| `/posture council` | `high` | Adds read/search tools and removes bash/edit/write. | Architecture discussion, trade-offs, risks, and durable design without file changes. |
| `/postures` | — | — | List all available guard postures and mark the active one. |

## Campaign record

| Command | Purpose |
| --- | --- |
| `/chronicle [message]` | Add a durable Falkensee campaign mark to the TUI record without adding it to model context. |
| `/chronicles` | Show recent Falkensee chronicle marks. |
| `/sessions` | List recent pi sessions/campaigns in the current dominion. Use pi's built-in `/resume <path>` to continue one. |

## Chamber and heraldry

| Command | Purpose |
| --- | --- |
| `/waldemar-arms` | Display `waldemar-of-falkensee.png` as a heraldic overlay when the terminal supports images. Unsupported terminals receive a clean file-path notice. |
| `/falkensee-compact` | Display the Falkensee Compact. |
| `/waldemar-theme [falkensee-heraldry\|chronicle-keeper]` | Switch the current TUI session's Waldemar livery. |

## Operations and setup

| Command | Purpose |
| --- | --- |
| `/waldemar-status` | Show a lightweight Waldemar operational/session status report. Not a health check. |
| `/waldemar-inventory` | List installed packages, configured MCP servers, and installed skills. Facts only, no readiness judgement. |
| `/waldemar-doctor` | Run package and machine readiness checks. Use this as the primary health check. |
| `/waldemar-system-prompt [first\|latest]` | Inspect the captured full system prompt in a scrollable TUI viewer. |
| `/waldemar-setup` | Reconcile global settings, theme, MCP config, external skills, and package dependency expectations. |
| `/waldemar-customize` | Show a concise customization map and point to the durable documentation. |

## Prompt templates

These are prompt-template invocations, not extension commands, but they are part of Waldemar's user workflow surface.

| Prompt | Purpose |
| --- | --- |
| `/write-ticket <context>` | Draft a Story with `ticket-writer`, validate it with `ticket-validator`, and iterate until no blocking gaps remain. |
| `/write-epic <context>` | Draft an Epic with `epic-writer`, validate it with `ticket-validator`, and iterate until no blocking gaps remain. |

See [`prompts.md`](prompts.md) for prompt-template decision rules.

## Shortcuts

| Shortcut | Purpose |
| --- | --- |
| `Ctrl+Shift+O` | Open the latest captured system prompt in the system prompt viewer. |

See [`keybindings.md`](keybindings.md) for shortcut policy and conflicts to avoid.

## Design policy

- Keep `/waldemar` as the interactive command hub.
- Keep `/waldemar-customize` short; durable details belong in `docs/`.
- Keep readiness checks in `/waldemar-doctor`.
- Keep inventory factual and status lightweight.
- Keep command behaviour in focused extension files, not in one monolithic extension.
- Update this file, `README.md`, and the relevant `docs/extensions/*.md` file whenever commands are added, removed, or materially changed.
