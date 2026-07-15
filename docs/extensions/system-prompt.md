# system-prompt.ts

Purpose: capture and inspect the effective system prompt that Waldemar of Falkensee sends into an agent turn.

Commands and shortcuts:

- `/waldemar-system-prompt` — show the first captured system prompt.
- `/waldemar-system-prompt latest` — show the latest captured system prompt.
- `Ctrl+Shift+O` — open the latest captured prompt, or the first prompt if no later capture exists. This shortcut is documented in `docs/keybindings.md`.

Implementation notes:

- Captures during `before_agent_start`, after earlier prompt-building extensions have contributed their chained prompt text.
- The first capture is preserved for inspection of the initial provider-bound prompt.
- The latest capture is updated every turn for debugging current posture, persona, tool, skill, and context effects.
- TUI mode uses a scrollable bordered viewer with line and character counts.
- Non-TUI modes fall back to a plain notification report.

Limitations:

- Provider-specific rewrites from `before_provider_request` are not reflected because pi exposes those as provider payload mutations, not as the canonical system prompt string.
