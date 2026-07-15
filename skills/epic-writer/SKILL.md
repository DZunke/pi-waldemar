---
name: epic-writer
description: Write Epic titles and descriptions in a consistent style based on style input provided by the user.
---

# Epic Writer Skill

## Goal
Write high quality Epic content with a stable, repeatable style.
This skill focuses only on title and description writing.

## Workflow
1. Confirm this request is for an Epic.
2. Gather missing context only when required:
   current situation, target situation, expected business or operational effect, boundaries.
3. Use provided references to extract domain rationale and system context.
4. Draft Epic narrative in this order:
   Current Situation -> Target Situation -> Expected Effect.
5. Expand abbreviations on first use in the body, then use short form.
6. Draft verification bullets as observable outcomes.
7. Return one fenced markdown block only.

## Style and Tone Instructions
- Keep the epic informative and broad enough to align multiple stories.
- Use explicit domain nouns and concrete terms.
- Use full written sentences in prose and verification bullets.
- Prefer clear, direct, non-idiomatic English.
- On first mention, write abbreviations in long form, then short form in parentheses.
   Example: `Beacon Configuration Orchestrator (BCO)`.
- Reuse technical reference formatting from `ticket-writer`:
   keep code symbols, environment variables, file paths, configuration keys, and commands in backticks.
- Keep epic writing epic-specific. Do not use story sections (`Story`, `ACs`, `Dev-Hints`) in this skill.

Epic template (fixed order):
1. `**Quick Summary**`
2. `**Benefit Hypothesis**`
3. `**Solution Verification**`
4. `**Open Questions**`

Section guidance:
- `Quick Summary`: 1 to 2 paragraphs covering current and target situation with sufficient domain background.
- `Benefit Hypothesis`: 1 paragraph explaining why this matters in domain terms and operational impact.
- `Solution Verification`: 1 to 5 measurable outcome bullets.
- `Open Questions`: bullet list, use `* None` when empty.

## Guardrails
- Reuse core safety and output guardrails from `ticket-writer`.
- Ask concise clarification questions when required epic context is missing instead of drafting.
- When enough context is available, return the fenced markdown block only.
- Keep this skill focused on epic-specific structure and quality.

Required wrapper format:
```markdown
Title: <title>

Description:
**Quick Summary**
...

**Benefit Hypothesis**
...

**Solution Verification**
* ...

**Open Questions**
* ...
```

## Examples
Full Epic example:
```markdown
Title: Beacon Platform: Runtime Configuration Contract Alignment

Description:
**Quick Summary**

Current runtime behavior for critical configuration inputs is inconsistent across environments, which causes operational uncertainty during deployments and incident handling. Some startup paths resolve values from environment configuration, while others bypass it through fixed defaults.

We need a single, explicit runtime configuration contract so all environments resolve the same critical inputs consistently and predictably. The `Beacon Configuration Orchestrator (BCO)` is expected to enforce this contract, but current execution paths are not yet aligned.

**Benefit Hypothesis**

If runtime configuration behavior is aligned to one explicit contract, deployments become safer, troubleshooting becomes faster, and teams can adjust operational settings without introducing source-level changes.

**Solution Verification**

* `Beacon Configuration Orchestrator (BCO)` applies the same runtime configuration source behavior across test and non-test environments for the targeted inputs.
* Operational configuration changes can be applied by environment setup without runtime code changes.
* Documented configuration contract and observed runtime behavior match for the targeted inputs.

**Open Questions**

* Which environment should be the first rollout checkpoint for contract-aligned runtime behavior?
* Which additional configuration inputs should be included in the same alignment wave?
```
