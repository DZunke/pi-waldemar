# Prompt Templates

Prompt templates are lightweight, explicit workflow entrypoints. They live in `prompts/` and are loaded by pi through the package manifest.

Use them when a workflow should be invoked on demand without changing Waldemar of Falkensee's always-on persona.

## Current templates

### `/write-ticket`

File: `prompts/write-ticket.md`

Purpose: write a Story ticket, validate it with the local ticket validator skill, and iterate until the result has no blocking quality gaps.

Flow:

1. Use `ticket-writer` to draft the Story.
2. Use `ticket-validator` to evaluate the draft.
3. Rewrite when validation finds Blocking or Important gaps.
4. Validate again.
5. Return the final ticket plus a short validation summary.

### `/write-epic`

File: `prompts/write-epic.md`

Purpose: write an Epic, validate it with the local ticket validator skill, and iterate until the result has no blocking quality gaps.

Flow:

1. Use `epic-writer` to draft the Epic.
2. Use `ticket-validator` to evaluate the draft as an Epic.
3. Rewrite when validation finds Blocking or Important gaps.
4. Validate again.
5. Return the final Epic plus a short validation summary.

If required context is missing, the templates tell Waldemar to ask concise clarification questions instead of inventing details.

## Decision flow: prompt, skill, posture, or extension?

Use this rule of thumb:

| Need | Best home |
| --- | --- |
| One-shot or on-demand workflow | `prompts/*.md` |
| Larger reusable method with examples, rules, and quality criteria | `skills/<name>/SKILL.md` |
| Persistent behavioral stance across turns | `extensions/postures.ts` |
| Hard automation, UI, multi-step command logic, or enforced loops | focused `extensions/*.ts` command |
| Always-on Waldemar identity and communication doctrine | `extensions/persona.ts` and `lib/waldemar.ts` |

## Promotion path

Start small:

1. Add a prompt template.
2. Dogfood it in real work.
3. If the workflow needs more reusable detail, promote it to a skill.
4. If the workflow needs enforced control flow, dialogs, or actual model-call loops, promote it to an extension command.

This keeps the command chamber useful without turning Waldemar's global system prompt into a crowded barracks.
