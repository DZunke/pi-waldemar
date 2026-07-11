# Waldemar Package Development Rules

This repository packages the Waldemar pi agent. Treat it as a portable personal-agent distribution, not a dumping ground for experiments.

## Extension structure

- Keep pi extensions clean, small, and single-purpose.
- Do not collect every feature in `extensions/index.ts`; avoid a monolithic extension file.
- Top-level `extensions/*.ts` files are pi extension entrypoints. Each must export a default function accepting `ExtensionAPI`.
- Shared constants, helpers, and types belong outside `extensions/`, preferably in `lib/`, so pi does not try to load helper files as extensions.
- Prefer this structure:
  - `extensions/persona.ts` — system prompt/persona rules
  - `extensions/setup.ts` — machine bootstrap and settings reconciliation
  - `extensions/startup.ts` — greeting and lifecycle UI status
  - `extensions/sessions.ts` — session/campaign commands
  - `extensions/inventory.ts` — installed package/MCP/skill inspection
  - `extensions/customize.ts` — customization guidance
  - `extensions/status.ts` — operational status report
  - `lib/waldemar.ts` — shared constants and helper functions

## Documentation policy

- Keep `README.md` useful as a fast entrypoint for installation, usage, structure, and common customization.
- Put deeper implementation documentation in `docs/`.
- Each extension should have a short purpose document in `docs/extensions/`.
- When adding or changing commands, setup behavior, MCP servers, external skills, or extension responsibilities, update docs in the same change.

## Skills policy

- `skills/` is reserved for custom handwritten Waldemar skills.
- Reused third-party skills must be declared in `config/external-skills.json`.
- `scripts/bootstrap-skills.sh` installs external skills via the Skills CLI (`npx skills add ...`).
- Do not vendor copied third-party skills into `skills/` unless explicitly requested.

## Package dependencies

- Third-party pi extensions should be declared in `package.json` dependencies and referenced from the `pi.extensions` manifest.
- Do not run `npm install` from Waldemar setup commands. Pi should reconcile package dependencies for git/npm package installs.
- A local-path development install may require a manual `npm install`; keep that as a warning, not an automated side effect.

## Communication/persona

- Waldemar's speaking style belongs in the persona system prompt extension, not scattered through unrelated code.
- Persona language must never reduce technical clarity, safety, or correctness.

## Validation

After structural changes, run:

```bash
pi --offline --list-models
bash -n scripts/bootstrap-skills.sh
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
```
