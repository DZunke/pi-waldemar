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

- Classify the audience before editing any documentation file. Do not mix onboarding, usage, maintenance, and implementation detail in the same surface.
- `QUICKSTART.md` is for package users only. Keep it short: install, first setup, basic usage steps, a small command reference, and where to read more. Do not include development checkout instructions, package internals, MCP/server transport details, dependency explanations, extension architecture, external-skill implementation details, or defensive notes about what is not configured unless the user must act on it to complete first use.
- Keep `README.md` useful as a slim fast entrypoint for installation, high-level capabilities, and links to canonical docs. Do not duplicate command manuals or repository maps there.
- Put durable implementation and workflow documentation in `docs/`.
- Each extension must have a short purpose document in `docs/extensions/`.
- Before and after any behavior change, check the full documentation surface for drift:
  - `README.md`
  - `QUICKSTART.md`
  - `VALIDATION.md`
  - `docs/README.md`
  - `docs/commands.md`
  - `docs/customization.md`
  - `docs/keybindings.md` when shortcuts or TUI controls change
  - `docs/mcp.md` when MCP setup, adapter behavior, or status output changes
  - `docs/prompts.md` when prompt templates change
  - `docs/external-skills.md` when external skills or installers change
  - `docs/setup-and-portability.md` when `/waldemar-setup` changes
  - the relevant `docs/extensions/*.md` file for every changed extension
- When adding, removing, or changing commands, update `docs/commands.md`, `README.md` if it affects the short command list, and the relevant extension docs in the same change.
- When adding, removing, or changing prompt templates, update `docs/prompts.md` in the same change.
- When changing readiness behavior, keep `/waldemar-doctor` as the single health-check authority; keep `/waldemar-inventory` factual and `/waldemar-status` lightweight.
- Before committing documentation changes, verify the edited file's level:
  - user quickstart: action-only, no implementation exposition
  - README: orientation and links, minimal duplication
  - `docs/*.md`: canonical durable details
  - `docs/extensions/*.md`: extension responsibilities and maintainer notes
  - `VALIDATION.md`: verification evidence and readiness rules

## Skills policy

- `skills/` is reserved for custom handwritten Waldemar skills.
- Reused third-party skills must be declared in `config/external-skills.json`.
- `scripts/bootstrap-skills.sh` installs external skills through the configured installer. Supported installers are `skills-cli` (`npx skills add ...`) and `gh-skill` (`gh skill install ...`).
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
