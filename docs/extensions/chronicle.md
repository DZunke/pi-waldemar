# chronicle.ts

Purpose: keep a durable Falkensee campaign chronicle inside the TUI without adding noise to the LLM context.

Commands:

- `/chronicle [message]` — add a campaign mark
- `/chronicles` — show recent chronicle marks

Responsibilities:

- registers a `waldemar-chronicle` custom entry renderer
- records TUI-only chronicle cards via `pi.appendEntry()`
- listens for `waldemar:chronicle` events from other extensions
- records compaction, campaign tree navigation, and session-name changes

Chronicle entries do not participate in model context. They are for the command chamber and the human campaign record only.
