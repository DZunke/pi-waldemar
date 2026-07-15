---
name: ticket-validator
description: Validate and improve Epic and Story writing quality using style input provided by the user and writing best practices.
---

# Ticket Validator Skill

## Goal
Review Epic and Story title plus description quality, score it, and provide concrete improvements.
This skill helps improve writing quality over time, not only pass or fail a single ticket.

## Style Input Source
Calibrate judgments against examples and style guidance provided in the current request.
If style inputs are missing or inconsistent, ask for additional examples before final scoring.
Key traits:
- Clear context before implementation detail.
- Outcome focused acceptance criteria.
- Consistent section headings.
- Pragmatic, direct language with team framing.
- Frequent expectation framing in stories, for example "I expect that ...".
- Full written sentences over shorthand fragments.
- First use of abbreviations is expanded in long form with short form in parentheses.

## Best Practice Alignment Checks
Include lightweight checks aligned with agile writing guidance:
- Card, Conversation, Confirmation: the written story should be clear, invite follow up conversation, and include testable confirmation.
- Story explains why and value, not only implementation.
- Story remains small enough to be deliverable within normal iteration boundaries.
- ACs are observable and verifiable.
- Epic and Story hierarchy is coherent and not contradictory.

## Validation Scope
Validate only content writing:
- Title quality.
- Description structure.
- Clarity and intent.
- Testability of acceptance criteria.
- Usefulness of developer hints.
- Domain alignment between epic and story context when linked.

Ignore tracker field configuration and workflow metadata.

## Rubric
Score each category from 0 to 5.

1. Structure Fidelity
- Correct section order for Epic or Story.
- For Epic: Quick Summary -> Benefit Hypothesis -> Solution Verification -> Open Questions.
- For Story: Story -> ACs -> Dev-Hints.
- Uses expected headings.
- Score anchors:
- 5: All required sections exist and order is exact.
- 3: All sections exist but order or heading format has minor issues.
- 1: One or more required sections are missing.

2. Context Clarity
- States problem, current pain, and target capability.
- Score anchors:
- 5: Problem, current pain, and target capability are explicit.
- 3: Problem and target exist, but current pain is weak or implied.
- 1: Only desired feature is stated.

2b. Epic Context Consistency (Story only)
- If story is epic linked, inherits and respects the epic's why and where.
- Story scope is consistent with epic intent and boundaries.
- If epic context is unknown, validator asks for epic summary before scoring this category.

3. Outcome Orientation
- Focuses on results and behavior, not only implementation tasks.
- Score anchors:
- 5: Majority of statements describe observable outcomes.
- 3: Mix of outcomes and implementation tasks.
- 1: Mostly implementation to do items.

4. Verification Quality
- For Stories: Acceptance Criteria (ACs) are specific, observable, and testable.
- For Epics: Solution Verification bullets are measurable, outcome oriented, and aligned with the epic target state.
- No duplicates or vague wording.
- Score anchors:
- 5: Every verification point is testable and unambiguous.
- 3: Some verification points are testable, some are vague.
- 1: Most verification points are broad or not measurable.

5. Tone Consistency
- Matches expected style profile: direct, practical, team oriented.
- Includes expectation framing for Story content where appropriate.
- Avoids generic filler that is detached from the domain.
- Uses full written sentences and avoids unclear shorthand.
- Expands abbreviations on first use (for example `Application Locale Service (ALS)`).
- Score anchors:
- 5: Team framing ("we") is present, domain specific language is clear, Story includes expectation framing, and abbreviations are expanded on first use.
- 3: Tone is generally practical but misses team framing, expectation framing, or first-use abbreviation clarity.
- 1: Tone is generic, detached, or inconsistent with the expected style profile.

6. Dev-Hints Value
- Helpful, concise, and non-noisy.
- Score anchors:
- 5: Hints are actionable, do not duplicate ACs, and provide repository discovery entry points.
- 3: Hints are partially useful but verbose or repetitive.
- 1: Hints are missing, noisy, or misleading.

## Required Output Format
Return these sections in order:

1. `Overall Score` as `X/30` for Stories or `X/25` for Epics
2. `Category Scores` as bullet list
3. `Critical Gaps` as bullet list with priority labels: Blocking, Important, Polish
4. `Suggested Rewrite` with improved title and full description
5. `Coaching Notes` with 3 to 5 writing lessons

## Validation Rules
- If required sections are missing, mark as critical gap.
- If ACs are not testable, provide rewritten ACs.
- If title lacks scope or action, provide 2 improved alternatives.
- If wording is generic, replace with domain grounded phrasing.
- Tier 1 fail rule: if Structure Fidelity or Context Clarity is <= 2, mark ticket as rewrite required.
- If story type cannot be determined as epic linked or self standing, ask before final scoring.
- If critical domain context is missing, request clarification instead of guessing.
- For epics, reject story-style sections (`Story`, `ACs`, `Dev-Hints`) as structure errors.
- For stories, reject epic-style sections (`Quick Summary`, `Benefit Hypothesis`, `Solution Verification`, `Open Questions`) as structure errors.

## Coaching Pattern
For each major weakness:
- Explain why it weakens delivery quality.
- Give one concrete rewrite pattern.
- Provide one before and after micro example.

## Progress Tracking
- If a previous validation exists, compare with the last score and summarize deltas.
- Highlight one category that improved and one next focus category.

## Fast Workflow
1. Detect ticket type.
2. Detect whether story is epic linked or self standing.
3. Check heading structure and order.
4. Score all categories.
5. Identify top 3 gaps.
6. Produce rewritten version with same intent.
7. Provide short coaching notes for future tickets.

## No Hallucination Rule
- Never infer missing business context as fact.
- Ask direct clarification questions when required details are absent.
- Mark uncertain points explicitly instead of fabricating details.

## Mini Example Output Shape
Overall Score: 22/30

Category Scores:
* Structure Fidelity: 5/5
* Context Clarity: 3/5
* Outcome Orientation: 4/5
* Verification Quality: 4/5
* Tone Consistency: 3/5
* Dev-Hints Value: 3/5

Critical Gaps:
* Blocking: Story context does not explain current pain clearly.
* Important: One AC is not measurable.

Suggested Rewrite:

```markdown
Title: Beacon API: Create Consistent Runtime Context Providers

[full rewritten markdown description]
```

Coaching Notes:
* Start each Story with the operational pain, not the planned implementation.
* Use AC verbs that can be observed in behavior, for example "is available", "is logged", "is validated".
* Keep Dev-Hints short and remove hints that duplicate ACs.

## Scoring Denominators
- Stories are scored out of 30 using these six categories: Structure Fidelity, Context Clarity, Outcome Orientation, Verification Quality, Tone Consistency, and Dev-Hints Value.
- Epics are scored out of 25 using these five categories: Structure Fidelity, Context Clarity, Outcome Orientation, Verification Quality, and Tone Consistency.
- Report Dev-Hints Value as N/A for Epics.
- Epic Context Consistency is advisory unless epic context is provided and the user explicitly asks for linked-story validation; when scored, report it separately as `Epic Context Consistency: X/5` and do not add it to the main denominator.
