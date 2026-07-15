# Waldemar of Falkensee

<p align="center">
  <img src="waldemar-of-falkensee.png" alt="Heraldic portrait of Waldemar of Falkensee" width="360">
</p>

A portable [pi](https://pi.dev/) coding-agent package for a disciplined personal codewright: Waldemar of Falkensee, Captain of the King's Personal Guard and Warden of the Ordered Line.

> Excellence is not negotiable. It is inevitable.

Waldemar packages persona, focused extensions, themes, prompts, custom skills, external skill bootstrap, and MCP configuration into one reusable agent distribution.

## What this package provides

- The Waldemar of Falkensee persona and operating doctrine grounded in [`HERALDRY.md`](HERALDRY.md)
- Focused pi extensions for setup, presence, postures, safeguards, sessions, inventory, chronicle, and status
- A command chamber via `/waldemar`
- The `falkensee-heraldry` and `chronicle-keeper` themes
- External skill bootstrap from [`config/external-skills.json`](config/external-skills.json)
- Codegraph MCP setup through `pi-mcp-adapter`

## Install

From a local checkout:

```bash
npm install --omit=dev
pi install .
```

From GitHub after publishing:

```bash
pi install git:github.com/DZunke/pi-waldemar
```

Then start pi and run:

```text
/waldemar-setup
/reload
```

For local development and fresh-machine notes, see [`QUICKSTART.md`](QUICKSTART.md) and [`docs/setup-and-portability.md`](docs/setup-and-portability.md).

## Main commands

Start with:

```text
/waldemar
```

Common direct commands:

- `/waldemar-setup` — reconcile global settings, external skills, and MCP config
- `/waldemar-status` — operational status report
- `/waldemar-inventory` — installed packages, MCP servers, and skills
- `/posture` — select the current guard posture
- `/chronicle` — add a campaign note
- `/waldemar-customize` — pointers for customization

Full command reference: [`docs/commands.md`](docs/commands.md).

## Repository map

```text
extensions/              pi extension entrypoints
lib/                     shared constants and helpers
skills/                  custom handwritten Waldemar skills
config/external-skills.json
scripts/bootstrap-skills.sh
themes/                  packaged pi themes
prompts/                 prompt templates
docs/                    package documentation
HERALDRY.md              character, arms, and house background
```

See [`docs/README.md`](docs/README.md) for the documentation index.

## External skills

Reused third-party skills are declared in [`config/external-skills.json`](config/external-skills.json), not vendored into `skills/`. The bootstrap supports both the Skills CLI and `gh skill install` for GitHub-hosted skills.

Details: [`docs/external-skills.md`](docs/external-skills.md).

## MCP

Waldemar configures Codegraph MCP only. Sentry usage is handled through external Sentry skills and the Sentry CLI, not MCP.

Details: [`docs/mcp.md`](docs/mcp.md).

## Development rules

This repository should remain a clean portable agent package. Keep extensions small and single-purpose, put shared helpers in `lib/`, and update docs with behavior changes.

Project rules: [`AGENTS.md`](AGENTS.md).

Recommended validation:

```bash
pi --offline --list-models
bash -n scripts/bootstrap-skills.sh
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
```

More validation notes: [`VALIDATION.md`](VALIDATION.md).

## License

MIT. See [`LICENSE`](LICENSE).
