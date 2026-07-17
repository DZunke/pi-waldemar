# system-prompt.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)


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
- Viewer rendering lives in `lib/system-prompt-viewer.ts`; the extension remains a small capture and command entrypoint.
- Waldemar-owned prompt sections use the shared section renderer in `lib/system-prompt.ts` so persona and posture additions remain consistently structured.
- Verbose installed skill listings are compacted by `extensions/skill-catalog.ts`; inspect `waldemar_skill_catalog` behavior there rather than adding skill lists to this viewer extension.

Limitations:

- Provider-specific rewrites from `before_provider_request` are not reflected because pi exposes those as provider payload mutations, not as the canonical system prompt string.
