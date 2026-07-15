# Waldemar Documentation

This directory explains how the Waldemar pi package is structured and how to modify it without turning the captain's quarters into a peasant storage shed.

## Start here

- [Architecture](architecture.md) — repository layout and design rules
- [Setup and Portability](setup-and-portability.md) — fresh-machine bootstrap flow
- [Command Reference](commands.md) — commands added by the Waldemar package
- [MCP Servers](mcp.md) — codegraph and sentry MCP configuration
- [External Skills](external-skills.md) — reused skills installed by the bootstrap script
- [Customization](customization.md) — where to change behaviour, tone, skills, prompts, and themes
- [Extension Index](extensions/README.md) — purpose of each focused extension

## Rules of the realm

- `extensions/*.ts` are pi extension entrypoints; keep them small and single-purpose.
- Shared constants and helpers belong in `lib/`.
- `skills/` is for custom handwritten Waldemar skills only.
- Reused third-party skills belong in `config/external-skills.json` and are installed by `scripts/bootstrap-skills.sh`.
- Third-party pi extensions belong in `package.json` dependencies and `pi.extensions`.
