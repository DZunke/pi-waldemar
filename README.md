# Waldemar of Falkensee

<p align="center">
  <img src="waldemar-of-falkensee.png" alt="Heraldic portrait of Waldemar of Falkensee" width="360">
</p>

Waldemar of Falkensee is a portable [pi](https://pi.dev/) coding-agent package for a disciplined personal codewright. It bundles Waldemar's lead-developer persona, focused extensions, role-based child agents, themes, prompts, skills, external-skill bootstrap, CodeGraph integration, and a usage dashboard.

> Excellence is not negotiable. It is inevitable.

## Key concepts

- **Portable package** — install Waldemar into pi and carry the same working style across machines.
- **Focused extensions** — commands and behavior stay split into small `extensions/*.ts` entrypoints instead of one monolith.
- **Pi-native discovery** — `tool_search`, `codemode`, and Pi's skill discovery expose specialist tools and workflows on demand; Waldemar does not duplicate those catalogs or override active-tool choices.
- **Role-based delegation** — Waldemar coordinates focused persona agents through bundled `pi-subagents`; project-specific model and concurrency choices remain yours.
- **Doctor before guesswork** — `/waldemar-doctor` is the authoritative readiness check; `/waldemar-inventory` stays factual.

## What this package provides

- Waldemar's persona and operating doctrine, grounded in [`HERALDRY.md`](HERALDRY.md)
- Focused Pi extensions for setup, package inventory, readiness checks, desktop notifications, TUI presence, and system-prompt inspection
- Bundled `pi-subagents` with starter personas for UI design (Jessica), bounded implementation/exploration (Brunhilde Nordwald), and product framing (Albert Metzler)
- Packaged themes: automatic light/dark `falkensee-heraldry` pair and `atlavium`
- Prompt workflows in [`prompts/`](prompts/)
- Custom local skills in [`skills/`](skills/)
- Reused third-party skill bootstrap from [`config/external-skills.json`](config/external-skills.json)
- CodeGraph MCP registration through Pi's built-in support; it is available automatically when Waldemar loads and enabled for indexed workspaces
- Bundled third-party `/usage` dashboard from `pi-extensions/usage-extension`

## Install

Use Pi 1.1.0 or newer. From a local checkout:

```bash
npm install --omit=dev
pi install .
```

From GitHub after publishing:

```bash
pi install git:github.com/DZunke/pi-waldemar
```

Then start pi. Run `/waldemar-setup` to apply Waldemar's recommended settings and bootstrap external skills; CodeGraph MCP registers automatically when the extension loads. Run `/reload` if setup installed or updated package dependencies.

If you are preparing a fresh machine, start with [`docs/setup-and-portability.md`](docs/setup-and-portability.md).

## Main commands

Use Pi's `/help` to see available commands. Common Waldemar commands:

- `/waldemar-setup` — reconcile Pi settings, external skills, and WSL notification defaults
- `/waldemar-doctor` — primary package and machine readiness check
- `/waldemar-inventory` — configured packages and MCP servers, extension registrations, and detected skills
- `/waldemar-tooling [gh|sentry-cli]` — install and setup guidance for required local CLI tools
- `/waldemar-system-prompt` — inspect the captured full system prompt
- `/waldemar-notifications [all|questions|settled|off|test]` — control desktop notifications for questions and completed work
- `/usage` — interactive usage statistics dashboard bundled from `pi-extensions`
- `subagent` tool — delegate bounded work to a named persona; `/subagents-fleet` inspects active runs

The canonical command roster lives in [`docs/commands.md`](docs/commands.md).

## When should you reach for Waldemar?

Choose Waldemar when you want a personal Pi package with strong defaults, a distinct but restrained personality, clear setup guidance, and a maintainable extension layout. If you only need a one-off pi configuration with no shared package structure, plain pi settings may be the simpler path.

## Documentation map

- [`docs/README.md`](docs/README.md) — documentation hub
- [`docs/architecture.md`](docs/architecture.md) — repository layout and design rules
- [`docs/setup-and-portability.md`](docs/setup-and-portability.md) — fresh-machine bootstrap and portability expectations
- [`docs/mcp.md`](docs/mcp.md) — automatic CodeGraph registration and Pi-native MCP behavior
- [`docs/external-skills.md`](docs/external-skills.md) — third-party skill bootstrap model
- [`docs/customization.md`](docs/customization.md) — where to change tone, setup, skills, prompts, and themes
- [`docs/personas-and-subagents.md`](docs/personas-and-subagents.md) — role profiles, delegation, model routing, and thread settings
- [`docs/extensions/README.md`](docs/extensions/README.md) — purpose of each focused extension

## Development rules

This repository is a portable agent package, not a dumping ground. Keep extensions small, keep shared helpers in `lib/`, and update the documentation surface when behavior changes.

- Project rules: [`AGENTS.md`](AGENTS.md)
- Validation guidance: [`VALIDATION.md`](VALIDATION.md)

Recommended validation:

```bash
pi --offline -e . --list-models
npm test
bash -n scripts/bootstrap-skills.sh
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
```

## License

MIT. See [`LICENSE`](LICENSE).
