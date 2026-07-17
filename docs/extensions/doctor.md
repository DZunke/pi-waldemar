# doctor.ts

Purpose: register `/waldemar-doctor`, the primary package and machine readiness report for Waldemar of Falkensee.

Checks include:

- package metadata and pi manifest
- required repository files such as `README.md` and `LICENSE`
- `pi-mcp-adapter` dependency presence
- native CodeGraph extension availability when the `codegraph` command is installed
- packaged themes
- local ticket-writing skills
- prompt workflow templates
- machine commands used by setup or skills: `codegraph`, `gh`, and `sentry-cli`
- global theme setting
- codegraph MCP compatibility configuration
- additional MCP servers configured outside Waldemar defaults
- installed external skill count

TUI mode renders a compact bordered report. Non-TUI modes print a plain report to stdout and also send a UI notification when available.

The shared implementation lives in `lib/doctor.ts` so `/waldemar-doctor` and the `/waldemar` command chamber use the same report path.

Warnings are not always failures. They often mean optional machine-local tooling has not been installed yet or `/waldemar-setup` has not been run on the current machine.
