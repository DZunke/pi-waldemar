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
- for registered CLI tools, warnings now point to `/waldemar-tooling <tool>` for explicit install and setup orders
- global theme setting
- codegraph MCP compatibility configuration
- additional MCP servers configured outside Waldemar defaults
- installed external skill count

Presentation policy:

- doctor gathers detailed probes internally but reports them as grouped readiness areas instead of one line per local state
- grouped areas currently cover package integrity, machine tooling, local configuration, and external skills
- each area reports only the worst aggregate state plus a short summary such as ready, needs attention, or out of sync
- detailed remediation still flows through `/waldemar-tooling` and `/waldemar-setup` rather than bloating the doctor panel

TUI mode renders a compact bordered report. Non-TUI modes print a plain report to stdout and also send a UI notification when available.

The shared implementation lives in `lib/doctor.ts` so `/waldemar-doctor` and the `/waldemar` command chamber use the same report path.

Warnings are not always failures. They often mean optional machine-local tooling has not been installed yet or `/waldemar-setup` has not been run on the current machine.
