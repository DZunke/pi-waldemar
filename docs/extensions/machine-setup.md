# machine-setup.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: register `/waldemar-setup` to apply recommended Pi settings and bootstrap configured external skills.

The command updates global settings while preserving explicit `defaultTools` choices, adds Pi-native `codemode` and `tool_search` defaults when not opted out, applies WSL notification preferences, reports CodeGraph readiness, and runs the configured skill bootstrap. Long-running bootstrap work publishes progress in the TUI.

Setup does not write a new MCP server entry or run `npm install`. It only removes the exact legacy CodeGraph entry previously written by Waldemar; customized entries and all other MCP servers are preserved. Pi manages the active CodeGraph connection. The setting merge lives in `lib/setup.ts`; package paths and bootstrap script constants live in `lib/waldemar.ts`.

For machine setup order and portability limits, see [`../setup-and-portability.md`](../setup-and-portability.md).
