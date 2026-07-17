# presence.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)


Purpose: make the TUI feel like Waldemar's command chamber without adding noise to every assistant response.

Responsibilities:

- replaces the default TUI header with a compact Falkensee banner
- sets a custom footer showing guard phase, posture, model, git branch, and thinking level
- sets a terminal title for the current dominion
- customizes the streaming working indicator and working messages
- listens for `waldemar:posture` events from the posture extension

Keep this extension visual and atmospheric. Behavioural rules belong in `persona.ts`; tool policy belongs in posture or safeguards extensions.
