# Waldemar Command Reference

[Back to docs index](README.md)

This page lists commands provided by Waldemar, its bundled usage dashboard, and the `pi-subagents` integration. Pi commands such as `/resume`, `/session`, `/settings`, `/help`, `/tree`, `/mcp`, and `/mcp-auth` remain available separately.

## Pi-native discovery

Pi provides `tool_search` and `codemode` for specialist tool discovery and use, plus native skill discovery through `/skill:<name>`. `/waldemar-setup` adds `codemode` and `tool_search` to `defaultTools` without overriding explicit user opt-outs.

## Waldemar commands

| Command | Purpose |
| --- | --- |
| `/waldemar-inventory` | List configured packages, MCP registrations, and detected skills. Facts only, no readiness judgment. |
| `/waldemar-doctor` | Run package and machine readiness checks. This is Waldemar's primary health check. |
| `/waldemar-tooling [gh\|sentry-cli]` | Show install, verification, and authentication guidance for CLI tools used by Waldemar skills. |
| `/waldemar-system-prompt [first\|latest]` | Inspect the captured system prompt in a scrollable TUI viewer. |
| `/waldemar-notifications [status\|all\|questions\|settled\|off\|test\|idle <seconds>]` | Configure desktop notifications for assistant questions and completed work. Cancelled runs do not generate completion notifications. |
| `/waldemar-setup` | Reconcile global Pi settings, bootstrap configured external skills, and apply WSL notification defaults. It does not write MCP configuration; CodeGraph registers when Waldemar loads. |

Use Pi's `/resume` to select or continue a session and `/session` for current-session statistics. Use `/settings` to select a theme.

## Subagent commands

The bundled `pi-subagents` extension registers the `subagent` tool for role-based delegation. Use `/subagents` to inspect or manage agent definitions, `/subagents-fleet` to inspect active runs, `/subagents-doctor` for diagnostics, and `/subagents-guide [topic]` for the installed extension's reference. `/subagent-cost` reports model usage. The third-party extension owns its full command surface; see [Personas and Subagents](personas-and-subagents.md) and the [upstream command guide](https://github.com/nicobailon/pi-subagents/blob/main/README.md).

## Bundled command

| Command | Purpose |
| --- | --- |
| `/usage` | Open the usage statistics dashboard bundled from `pi-extensions/usage-extension`. |

## Prompt templates

These are prompt-template invocations, not extension commands, but they are part of Waldemar's user workflow surface.

| Prompt | Purpose |
| --- | --- |
| `/write-ticket <context>` | Draft a Story with `ticket-writer`, validate it with `ticket-validator`, and iterate until no blocking gaps remain. |
| `/write-epic <context>` | Draft an Epic with `epic-writer`, validate it with `ticket-validator`, and iterate until no blocking gaps remain. |

See [`prompts.md`](prompts.md) for Waldemar's prompt-template decision rules.

## Shortcut

| Shortcut | Purpose |
| --- | --- |
| `Ctrl+Shift+O` | Open the latest captured system prompt in the viewer. |

See [`keybindings.md`](keybindings.md) for shortcut policy and conflicts to avoid.

## Design policy

- Prefer Pi's native commands and discovery surfaces when they already provide the capability.
- Keep `/waldemar-doctor` as the readiness authority, `/waldemar-inventory` factual, and prefer Pi's `/session` over a duplicate Waldemar status command.
- Keep command behavior in focused extension files, not in one monolithic entrypoint.
- Update this file, `README.md` when its short command list is affected, and the matching extension page whenever a command changes.
