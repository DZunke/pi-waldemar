# setup.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)


Purpose: register `/waldemar-setup` and reconcile the machine with Waldemar defaults.

Responsibilities:

- global pi settings, including the `falkensee-heraldry` theme, medium thinking, display polish, compaction, retry, branch-summary, image, and skill-command defaults
- WSL-aware default notification enablement through `~/.pi/agent/waldemar-notifications.json`
- native CodeGraph readiness messaging plus MCP compatibility configuration
- external skills bootstrap
- explicit summary hints for missing machine local CLI tools registered in `lib/tooling.ts`
- setup progress status
- dependency warnings for local-path installs

Shared constants live in `lib/waldemar.ts`. The external skill list lives in `config/external-skills.json`.
