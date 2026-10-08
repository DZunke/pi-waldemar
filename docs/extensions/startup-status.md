# startup-status.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: show a brief startup note and keep Waldemar's visible lifecycle status accurate.

On a fresh startup, the extension reports the current project, then offers `/waldemar-setup` when the global settings do not request a quiet startup. Pi's `/resume` and `/session` own session selection and statistics. The extension updates the status line for ready, working, completed, and cancelled runs; an aborted run is never reported as completed.

Keep the message factual and brief. Waldemar's identity belongs in `persona.ts`, while the persistent TUI layout belongs in `tui-presence.ts`.
