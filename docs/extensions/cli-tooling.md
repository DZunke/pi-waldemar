# cli-tooling.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: register `/waldemar-tooling`, explicit installation and setup guidance for machine-local CLI tools used by Waldemar skills.

The command lists missing requirements by default or provides install, verification, and follow-up guidance for a selected tool such as `gh` or `sentry-cli`. Keeping platform instructions here prevents `/waldemar-doctor` and `/waldemar-setup` from accumulating installation detail.

Add future CLI requirements to the shared registry in `lib/tooling.ts`; keep command handling focused in `extensions/cli-tooling.ts`.
