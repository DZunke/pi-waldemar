# tui-presence.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: add Waldemar's identity and useful runtime details to the Pi TUI without changing agent instructions.

The extension sets a project-specific terminal title, a branded header, and a footer containing run state, model, Git branch, thinking level, and up to two extension statuses. It also sets the working indicator and short code-focused progress messages. A cancelled run is displayed separately from a completed run through `agent_settled.aborted`.

The UI keeps a small amount of Falkensee styling while using functional labels. Keep visual behavior here; communication rules belong in `persona.ts`, and startup status messages belong in `startup-status.ts`.
