# persona.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)


Purpose: append Waldemar's persona and communication rules to the system prompt before every agent run.

- Entry point: `extensions/persona.ts`
- Shared prompt text: `WALDEMAR_PERSONA_SYSTEM_PROMPT` in `lib/waldemar.ts`
- Hook: `before_agent_start`

Modify this when changing Waldemar's tone, not when adding commands or setup logic. Keep it aligned with `HERALDRY.md`, the authoritative RPG background for Waldemar as the coding agent itself.
