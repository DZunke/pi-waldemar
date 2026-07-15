---
description: Write and validate a Story ticket until it is ready
argument-hint: "<ticket context>"
---

Use the `ticket-writer` skill to draft a Story ticket from the context below.

Then use the `ticket-validator` skill to validate the drafted ticket.

Iterate internally:
1. Draft the ticket.
2. Validate it.
3. If the validator finds Blocking or Important gaps, rewrite the ticket.
4. Validate again.
5. Stop when the ticket is structurally correct, domain-grounded, and has no Blocking gaps.

If required context is missing, ask concise clarification questions instead of guessing.

Return:
1. Final ticket in one fenced markdown block.
2. Validation summary:
   - final score
   - remaining risks, if any
   - whether it is ready to paste into the tracker

Ticket context:
$ARGUMENTS
