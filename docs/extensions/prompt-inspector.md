# prompt-inspector.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: capture and inspect the effective system prompt sent into an agent turn.

Commands and shortcuts:

- `/waldemar-system-prompt` — show the first captured system prompt.
- `/waldemar-system-prompt latest` — show the latest captured system prompt.
- `Ctrl+Shift+O` — open the latest captured prompt, or the first prompt if no later capture exists. This shortcut is documented in `docs/keybindings.md`.

The extension captures during `before_agent_start`, after earlier handlers have contributed prompt sections or text. It preserves the first capture and updates the latest capture each turn, which is useful for debugging persona, structured prompt sections, tools, skills, and context effects. TUI mode uses a scrollable viewer; non-TUI modes receive a plain notification report.

Viewer rendering lives in `lib/system-prompt-viewer.ts`. Persona text uses the shared section renderer in `lib/system-prompt.ts`, and CodeGraph contributes through Pi's structured `systemPromptOptions.sections` API. Provider-specific payload rewrites are not reflected because Pi does not expose them as part of the canonical system-prompt string.
