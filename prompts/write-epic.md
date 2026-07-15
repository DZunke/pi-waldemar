---
description: Write and validate an Epic until it is ready
argument-hint: "<epic context>"
---

Use the `epic-writer` skill to draft an Epic from the context below.

Then use the `ticket-validator` skill to validate the drafted Epic.

Iterate internally:
1. Draft the Epic.
2. Validate it as an Epic.
3. If the validator finds Blocking or Important gaps, rewrite the Epic.
4. Validate again.
5. Stop when the Epic is structurally correct, domain-grounded, and has no Blocking gaps.

If required context is missing, ask concise clarification questions instead of guessing.

Return:
1. Final Epic in one fenced markdown block.
2. Validation summary:
   - final score
   - remaining risks, if any
   - whether it is ready to paste into the tracker

Epic context:
$ARGUMENTS
