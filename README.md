# Waldemar of Falkensee

<p align="center">
  <img src="waldemar-of-falkensee.png" alt="Heraldic portrait of Waldemar of Falkensee" width="360">
</p>

A portable [pi](https://pi.dev/) coding-agent package for a disciplined personal codewright: Waldemar of Falkensee, Captain of the King's Personal Guard and Warden of the Ordered Line.

> Excellence is not negotiable. It is inevitable.

Waldemar packages persona, focused extensions, themes, prompts, custom skills, external skill bootstrap, and CodeGraph integration into one reusable agent distribution.

## What this package provides

- The Waldemar of Falkensee persona and operating doctrine grounded in [`HERALDRY.md`](HERALDRY.md)
- Focused pi extensions for setup, presence, postures, safeguards, sessions, inventory, doctor, chronicle, status, and system-prompt inspection
- A command chamber via `/waldemar`
- The `falkensee-heraldry` and `chronicle-keeper` themes
- External skill bootstrap from [`config/external-skills.json`](config/external-skills.json)
- Native CodeGraph tools when the workspace has a `.codegraph` index
- Optional CodeGraph MCP compatibility through `pi-mcp-adapter`

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

For local development and fresh-machine notes, see [`docs/setup-and-portability.md`](docs/setup-and-portability.md).

## Main commands

Start with:

```text
/waldemar
```

Common direct commands:

- `/waldemar-setup` — reconcile global settings, external skills, and MCP config
- `/waldemar-status` — lightweight operational/session status report
- `/waldemar-inventory` — installed packages, MCP servers, and skills
- `/waldemar-doctor` — primary package and machine readiness check
- `/waldemar-system-prompt` — inspect the captured full system prompt
- `/posture` — select the current guard posture
- `/chronicle` — record a TUI-only decision or milestone
- `/waldemar-customize` — pointers for customization

Full command reference: [`docs/commands.md`](docs/commands.md).

## Documentation

Use [`docs/README.md`](docs/README.md) as the documentation index. It covers architecture, setup, commands, prompt templates, keybindings, MCP behavior, external skills, customization, and extension responsibilities.

## External skills

Reused third-party skills are declared in [`config/external-skills.json`](config/external-skills.json), not vendored into `skills/`. The bootstrap supports both the Skills CLI and `gh skill install` for GitHub-hosted skills.

Details: [`docs/external-skills.md`](docs/external-skills.md).

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
