# tooling.ts

Purpose: register `/waldemar-tooling`, the explicit setup guide for machine local CLI tools used by Waldemar skills.

Responsibilities:

- exposes install, verification, and follow up setup guidance for registered CLI requirements
- keeps CLI specific guidance out of `doctor.ts` and `setup.ts` so future tool additions remain metadata driven
- supports optional argument completion for known tools such as `gh` and `sentry-cli`

This extension should stay narrow. Add future tool guidance by extending the shared registry in `lib/tooling.ts`, not by hardcoding more strings in command handlers.
