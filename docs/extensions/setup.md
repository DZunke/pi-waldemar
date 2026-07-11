# setup.ts

Purpose: register `/waldemar-setup` and reconcile the machine with Waldemar defaults.

Responsibilities:

- global pi settings
- MCP server configuration
- external skills bootstrap
- setup progress status
- dependency warnings for local-path installs

Shared constants live in `lib/waldemar.ts`. The external skill list lives in `config/external-skills.json`.
