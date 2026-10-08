# Extension Index

[Back to docs index](../README.md)

Every top-level file in `extensions/` is a Pi entrypoint. This index also covers bundled third-party extensions such as `pi-subagents`. Names describe each responsibility, and the linked pages identify the implementation boundary.

## Identity and interface

- [persona](persona.md) — Waldemar's identity and communication style
- [tui-presence](tui-presence.md) — TUI title, header, footer, and working indicator
- [startup-status](startup-status.md) — startup note and accurate lifecycle status
- [desktop-notifications](desktop-notifications.md) — optional desktop alerts and their preferences
- [prompt-inspector](prompt-inspector.md) — inspect the effective system prompt

## Package and readiness information

- [package-inventory](package-inventory.md) — factual package, MCP, and skill inventory
- [readiness-check](readiness-check.md) — package and machine readiness checks

## Setup and integrations

- [machine-setup](machine-setup.md) — reconcile Pi settings and bootstrap configured skills
- [cli-tooling](cli-tooling.md) — install and setup guidance for skill-related CLI tools
- [subagents](subagents.md) — bundled `pi-subagents` integration and child-agent boundaries
- [codegraph](codegraph.md) — CodeGraph registration through Pi's built-in MCP support

## Finding the right implementation

Start with the behavior or command you want to change, then open the corresponding page and implementation. Shared helpers and types belong in `lib/`, not in the extension entrypoint directory. For Pi-native facilities such as `/resume`, `/settings`, MCP, tools, and skills, prefer Pi's own interface unless Waldemar adds a distinct capability.

Keep this index and the matching command documentation current when an extension changes.
