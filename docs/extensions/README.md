# Extension Index

[Back to docs index](../README.md)

This section is the focused map of Waldemar's extension layer. Each top-level file in `extensions/` is a pi entrypoint, so each page here explains one responsibility boundary and points you to the exact command or behavior it owns.

## Why keep the extension docs split?

Because the package itself is split. Waldemar deliberately avoids a monolithic extension file. That means the docs should help you answer a precise question quickly: which extension owns posture changes, where readiness checks live, why the command chamber stages setup instead of running it, or how native CodeGraph tools enter the prompt.

If you are changing behavior, read the matching page first, then open the implementation file. If you are adding new behavior, utilize this index to find the closest existing responsibility before you create a new extension.

## Extension groups

### Identity and always-on behavior

- [persona](persona.md) — Waldemar's persona and communication doctrine
- [presence](presence.md) — title, header, footer, and working indicator surfaces
- [startup](startup.md) — startup rapport and lifecycle status behavior
- [reasoning](reasoning.md) — provider reasoning-summary policy
- [system-prompt](system-prompt.md) — captured system-prompt inspection

### Command room and operator workflows

- [chamber](chamber.md) — `/waldemar`, heraldry, compact, and theme controls
- [postures](postures.md) — guard formations and active-tool changes
- [sessions](sessions.md) — session and campaign listing
- [chronicle](chronicle.md) — TUI-only durable decision records
- [customize](customize.md) — `/waldemar-customize` guide surface
- [status](status.md) — lightweight operational status

### Readiness, tooling, and package inventory

- [setup](setup.md) — `/waldemar-setup` reconciliation flow
- [doctor](doctor.md) — package and machine readiness checks
- [inventory](inventory.md) — factual package, MCP, and skill inventory
- [tooling](tooling.md) — explicit CLI install and setup guidance for skills
- [safeguards](safeguards.md) — confirmations for risky operations

### Discovery and integrations

- [tool-catalog](tool-catalog.md) — compact default tool exposure with searchable specialist activation
- [skill-catalog](skill-catalog.md) — compact skill exposure with on-demand loading
- [codegraph](codegraph.md) — native CodeGraph registration and prompt guidance

## How to utilize this section

- Start with the command or behavior you want to change.
- Open the matching page here.
- Follow its pointers into `extensions/` or `lib/`.
- Update the relevant command docs in [`../commands.md`](../commands.md) when user-facing behavior changes.

If you add, remove, or materially reshape an extension, please keep this index current so the next maintainer can navigate the line in the best possible way.
