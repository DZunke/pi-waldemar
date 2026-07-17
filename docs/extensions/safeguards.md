# safeguards.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)


Purpose: encode Waldemar's loyal dissent around commands and file mutations that carry real risk.

Responsibilities:

- intercepts hazardous `bash` commands before execution
- asks for confirmation before editing or writing secret-bearing paths such as `.env`, private keys, credentials, or token files
- asks for confirmation before lockfile, schema, or migration changes
- warns once per session before mutating a dirty git working tree
- keeps safeguard confirmations out of the chronicle by default; use `/chronicle` manually when a decision should be preserved

The extension should remain conservative and practical. It is not roleplay for its own sake: the captain objects when a command could damage the realm, hide uncertainty, or mix campaigns in the same working tree.

In non-UI modes, high-risk operations are blocked instead of prompting.
