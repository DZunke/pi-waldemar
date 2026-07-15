# chronicle.ts

Purpose: keep a durable Waldemar of Falkensee campaign chronicle inside the TUI without adding noise to the LLM context.

## What chronicles are

Chronicles are custom pi session entries with custom type `waldemar-chronicle`.

They are rendered as styled chronicle cards in the conversation UI and stored in the session history, but they are not intended as instructions to the model. They exist for the human campaign record: milestones, decisions, validation marks, branch changes, compaction events, and safeguard decisions that should remain visible when reviewing the session.

Think of them as a command-room logbook, not as prompt content.

## Commands

- `/chronicle [message]` — manually add a campaign mark.
- `/chronicles` — show the most recent chronicle marks in the current branch.

Examples:

```text
/chronicle agreed to remove Sentry MCP and use Sentry CLI instead
/chronicle validation passed before release tag
```

## Automatic chronicle entries

This extension also records events emitted by other Waldemar extensions, including:

- compaction events
- campaign tree navigation
- session-name changes
- posture changes
- safeguard confirmations or declined objections

## Why not just write a normal message?

Normal conversation messages can become part of future model context. Chronicle entries are meant to be durable UI records without spending prompt tokens or changing the agent's instructions.

Use chronicles for:

- human-visible milestones
- decisions worth preserving
- audit breadcrumbs
- readiness or validation marks
- notable session navigation events

Do not use chronicles for:

- instructions the model must follow
- requirements that belong in code, docs, or tickets
- detailed long-form notes that should live in a repository file

## Responsibilities

- registers a `waldemar-chronicle` custom entry renderer
- records TUI-only chronicle cards via `pi.appendEntry()`
- listens for `waldemar:chronicle` events from other extensions
- records selected session lifecycle events

Chronicle entries are for the command chamber and the human campaign record only.
