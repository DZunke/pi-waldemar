# doctor.ts

Purpose: register `/waldemar-doctor`, the primary package and machine readiness report for Waldemar of Falkensee.

Checks include:

- package metadata and pi manifest
- required repository files such as `README.md` and `LICENSE`
- `pi-mcp-adapter` dependency presence
- packaged themes
- local ticket-writing skills
- prompt workflow templates
- machine commands used by setup or skills: `codegraph`, `gh`, and `sentry-cli`
- global theme setting
- codegraph MCP configuration
- installed external skill count

TUI mode renders a compact bordered report. Non-TUI modes fall back to a plain notification report.

Warnings are not always failures. They often mean optional machine-local tooling has not been installed yet or `/waldemar-setup` has not been run on the current machine.
