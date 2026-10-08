# readiness-check.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: register `/waldemar-doctor`, the package's single package and machine readiness report.

Checks include package metadata and required repository files, CodeGraph registration and workspace requirements, packaged themes and prompt/skill files, machine CLI requirements, the global theme setting, and installed external skills. Missing CLI tools point to `/waldemar-tooling`; setup guidance remains in `/waldemar-setup`.

The shared checks and report rendering live in `lib/doctor.ts`. TUI mode presents a bordered report; non-TUI mode prints the same findings as plain text. This command is the readiness authority: `/waldemar-inventory` reports configuration facts, while Pi's `/session` reports current-session statistics.
