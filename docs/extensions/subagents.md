# pi-subagents

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: bundle Pi-native child sessions so Waldemar can delegate to focused, independently prompted personas without reimplementing Pi's thread lifecycle.

- Package: `pi-subagents` is pinned and bundled in `package.json` and `package-lock.json`.
- Extension entrypoint: `./node_modules/pi-subagents/index.js`, declared in the package's `pi.extensions` list.
- Role definitions: `agents/` is declared in `pi.subagents.agents`; user and project agents retain higher discovery priority.
- Starter personas: Jessica, Brunhilde Nordwald, and Albert Metzler.

Only the subagent runtime is exposed; optional upstream prompt and skill catalogs are intentionally not added to Waldemar's prompt surface. The package does not install its own concurrency or model preferences into user settings. Role prompts set deliberate context and tool boundaries; parent-session decisions, integration, and final QA remain Waldemar's responsibility. See [Personas and Subagents](../personas-and-subagents.md) for the local operating model and the [upstream pi-subagents documentation](https://github.com/nicobailon/pi-subagents/blob/main/README.md) for the full third-party feature surface.
