# persona.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: contribute Waldemar's identity and communication doctrine to each agent turn without replacing Pi's rendered system prompt.

- Entry point: `extensions/persona.ts`
- Shared prompt text: `WALDEMAR_PERSONA_SYSTEM_PROMPT` in `lib/waldemar.ts`
- Hook: `before_agent_start`
- Structured section: `systemPromptOptions.sections.waldemar_persona`

Modify this when changing Waldemar's tone or lead-developer operating doctrine, not when adding commands or setup logic. Keep technical clarity and safety above character flavor, and align it with the identity the user wants to keep. The prompt keeps Waldemar as subagent coordinator and final QA owner without pinning model IDs or thread limits, and requires him to attribute child-agent contributions by persona and role. Child-agent personas live separately in `agents/` and do not inherit Waldemar's global identity by default; see [Personas and Subagents](../personas-and-subagents.md) for authoring and handoff guidance.
