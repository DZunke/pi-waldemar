# chronicle.ts

Purpose: keep a durable Waldemar of Falkensee decision chronicle inside the TUI without adding noise to the LLM context.

## What chronicles are

Chronicles are custom pi session entries with custom type `waldemar-chronicle`.

They are rendered as styled chronicle cards in the conversation UI and stored in the session history, but they are not model instructions. They exist for the human campaign record: decisions, milestones, validation marks, and audit breadcrumbs that should remain visible when reviewing the session.

Think of them as a command-room decision logbook, not as prompt content and not as an automatic event stream.

## Scope and persistence

Chronicles are scoped to the current pi session and active campaign tree branch.

- A new session starts with an empty chronicle.
- Resuming a session restores chronicle entries stored in that session file.
- `/chronicles` shows recent chronicle entries on the current branch path.
- Chronicle entries are persisted in the session JSONL as custom entries.
- Chronicle entries are not global memory and are not shared across sessions.

## Commands

- `/chronicle <decision or milestone>` — manually record a decision or milestone.
- `/chronicles` — show the most recent chronicle marks in the current branch.

Examples:

```text
/chronicle agreed to remove Sentry MCP and use Sentry CLI instead
/chronicle validation passed before release tag
/chronicle decided to keep Doctor as the single readiness authority
```

## Design rule

Chronicles are deliberate by default.

The package should not automatically record every confirmation dialog, posture change, compaction, or navigation event as a chronicle. Those events can be noisy and often do not represent durable decisions by His Majesty.

If something is important enough to preserve, record it intentionally with `/chronicle`.

## Why not just write a normal message?

Normal conversation messages can become part of future model context. Chronicle entries are meant to be durable UI records without spending prompt tokens or changing the agent's instructions.

Use chronicles for:

- decisions worth preserving
- human-visible milestones
- audit breadcrumbs
- readiness or validation marks
- explicit architecture/product choices

Do not use chronicles for:

- instructions the model must follow
- every safeguard prompt or confirmation
- routine posture changes
- requirements that belong in tickets, docs, or code
- detailed long-form notes that should live in a repository file

## Responsibilities

- registers a `waldemar-chronicle` custom entry renderer
- records TUI-only chronicle cards via `pi.appendEntry()`
- listens for explicit `waldemar:chronicle` events from other extensions when they represent deliberate decisions

Chronicle entries are for the command chamber and the human campaign record only.
