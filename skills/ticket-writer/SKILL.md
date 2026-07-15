---
name: ticket-writer
description: Write Story titles and descriptions in a consistent style based on style input provided by the user.
---

# Ticket Writer Skill

## Goal
Write high quality Story content with a stable, repeatable style.
This skill focuses only on title and description writing.
Use `epic-writer` for epic writing.

## Workflow
1. Gather missing context only when required: primary domain subject, current situation, target situation, domain expectation, constraints.
2. If story belongs to a larger container, inherit domain why and where from that parent context.
3. Read provided references and extract domain rationale, not only implementation details.
4. Draft Story text in this order: Current Situation -> Target Situation -> Domain Expectation.
5. Expand abbreviations on first use in the body, then use short form.
6. Draft ACs as outcome checks only.
7. Draft Dev-Hints as high value discovery entry points.
8. Return one fenced markdown block only.

## Style and Tone Instructions
- Keep the story rich in domain background so developers understand why change is needed.
- Use full written sentences in prose and ACs. Avoid sentence fragments.
- Prefer clear, direct, non-idiomatic English. Avoid slang and rhetorical language.
- On first mention, write abbreviations in long form, then short form in parentheses. Example: `Application Locale Service (ALS)`.
- Prefer clear, explicit nouns for subjects. Avoid vague wording like "the service" when a concrete name exists.
- Keep technical references formatted with backticks: code symbols, environment variables, file paths, configuration keys, commands.
- Do not mention relationship status in story prose unless explicitly requested. Example: do not say "this is self standing" in the Story body.

Story template (fixed order):
1. `**Story**`
2. `**ACs**`
3. `**Dev-Hints**`

Story depth guidance:
- `Story` section should at least have 2 to 4 paragraphs but as long as needed to explain the domain context and rationale.
- Include one explicit expectation sentence when useful: "I expect that ...".
- The Story section should have a clear problem statement, current situation, target situation, and domain expectation.
- The Story should cover the use-case fully, so reading the Story alone is sufficient to understand the domain context and rationale for this piece of work.

AC rules:
- 1 to 4 ACs. One strong AC is valid.
- Outcome focused and observable.
- No documentation tasks as ACs.
- No test-writing tasks as ACs.
- No speculative opposite-case AC when user input defines an invariant.
- ACs must read as full domain statements, not implementation instructions.
- ACs should avoid undefined subjects. Name the concrete domain subject.

Dev-Hints rules:
- Hints must explain where useful evidence or constraints are likely found.
- Avoid generic working instructions such as "review" or "check" without value.
- Avoid generic search tips unless a search pattern is genuinely non-obvious.
- No local markdown links or vscode URIs.
- Use plain text paths and symbols in backticks.

## Guardrails
- Do not invent facts that were not provided or inferable from supplied references.
- Ask concise clarification questions when key context is missing instead of drafting.
- When enough context is available, keep all output inside a single fenced markdown block.
- Do not output raw HTML.
- Do not include tracker metadata fields.

Required wrapper format:
```markdown
Title: <title>

**Story**
...

**ACs**
* ...

**Dev-Hints**
* ...
```

## Examples
Full Story example:
```markdown
Title: Beacon API: Restore Runtime Locale Configuration Resolution

**Story**

Today, runtime locale selection in Beacon API diverges from the documented configuration contract. The `Application Locale Service (ALS)` expects the environment variable `APP_LOCALE_FILE` as runtime input, but one runtime wiring path still relies on a fixed configuration path.

We need locale configuration resolution to consistently use `APP_LOCALE_FILE` during startup so operators can control locale source files through environment setup and avoid behavior drift between deployments. This is important because rollout environments use different locale bundles and require predictable source selection.

I expect runtime behavior to align with the documented contract, so changing `APP_LOCALE_FILE` to a valid path updates the effective locale source on next startup without code edits.

**ACs**

* `Application Locale Service (ALS)` resolves locale configuration from `APP_LOCALE_FILE` during runtime startup.
* Runtime locale resolution no longer depends on a hardcoded path in production wiring.
* Locale source behavior is consistent with the documented runtime configuration contract across runtime environments.

**Dev-Hints**

* Runtime parameter binding for locale source path is usually declared in `config/services.yaml`; compare with test-specific wiring in `config/services_test.yaml`.
* Locale source file loading is typically implemented in a filesystem-backed repository class under `src/Storage`.
* The configuration contract and startup expectations are usually documented under `docs/configuration.md`.
```
