# Waldemar Documentation

This directory is the documentation hub for the Waldemar Pi package. Start here to understand the package, set up a machine, or find the command or extension responsible for a behavior.

## Key concepts

- **One package, many focused surfaces** — Waldemar keeps persona, setup, commands, prompts, themes, and skills in one reusable distribution, but the behavior is deliberately split across focused extensions and docs pages.
- **Operational clarity first** — `/waldemar-doctor` judges readiness, `/waldemar-inventory` reports facts, and the docs follow the same separation so reference pages stay honest.
- **Portable customization** — machine-local setup is explicit, third-party dependencies stay declared, and customization points are documented instead of hidden in prompt folklore.
- **Operator feedback beyond the terminal** — optional desktop notifications can call you back when Waldemar is done or waiting on your answer.
- **Pi-native discovery** — `tool_search` and `codemode` find specialist tools, while Pi's skill discovery loads reusable workflows without Waldemar maintaining duplicate catalogs.
- **Multiple specialist personas** — Waldemar coordinates focused child agents through bundled `pi-subagents`, while each role keeps its own prompt and tool boundary.

## Why this documentation is split the way it is

You usually do not come here with one question called “Waldemar.” You come with a more precise question: how setup works, why MCP behaves a certain way, where a command is implemented, or which file governs persona and tone. So the good part about this docs set is that it does not try to answer everything in one long page. This hub explains the package and routes you to the focused view that can actually help.

Waldemar is a personal-agent package designed to remain portable across machines and maintainable over time. The documentation should help you operate it today and modify it later without turning `extensions/` into an assortment of unrelated code.

## What this documentation owns

This docs set covers:

- repository architecture and package boundaries
- setup, portability, and machine-local prerequisites
- command behavior and shortcut policy
- MCP and native CodeGraph integration
- prompt templates, local skills, and external-skill bootstrap
- role-based subagent delegation and persona boundaries
- customization entrypoints and extension responsibilities

It does **not** try to duplicate every implementation detail from the code. When you need the exact behavior, these pages point you to the file that owns it.

## When should you read which page?

If you are new to the package, start with setup and commands. If you are debugging an integration, go to MCP, external skills, or readiness-check documentation. If you are changing behavior, read architecture first, then the relevant extension page and customization guide.

## Documentation map

### Core package views

- [Architecture](architecture.md) — repository layout, extension structure, and dependency rules
- [Setup and Portability](setup-and-portability.md) — fresh-machine bootstrap flow and `/waldemar-setup` boundaries
- [Command Reference](commands.md) — canonical command roster and workflow-facing policy
- [Customization](customization.md) — where to change tone, setup, prompts, skills, themes, and tool exposure

### Integrations and workflow support

- [Personas and Subagents](personas-and-subagents.md) — role agents, delegation workflow, model routing, and concurrency considerations
- [MCP Servers](mcp.md) — automatic CodeGraph registration through Pi's built-in MCP support
- [External Skills](external-skills.md) — third-party skill registry, installers, and CLI prerequisites
- [Prompt Templates](prompts.md) — `/write-ticket`, `/write-epic`, and prompt-vs-skill promotion rules
- [Keybindings](keybindings.md) — active shortcut policy and future-binding guardrails

### Extension views

- [Extension Index](extensions/README.md) — one page per focused extension, grouped by responsibility

## Boundaries and maintenance

Please note: the README stays a slim package entrypoint, this directory carries the durable details, and `docs/extensions/*.md` explain extension responsibilities without becoming code dumps. When you change behavior, update the relevant focused page in the same change so the documentation remains accurate.
