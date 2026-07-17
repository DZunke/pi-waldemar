# Waldemar of Falkensee

<p align="center">
  <img src="waldemar-of-falkensee.png" alt="Heraldic portrait of Waldemar of Falkensee" width="360">
</p>

Waldemar of Falkensee is a portable [pi](https://pi.dev/) coding-agent package for a disciplined personal codewright. It delivers one opinionated bundle: persona, focused extensions, themes, prompts, custom skills, external-skill bootstrap, CodeGraph integration, and a bundled usage dashboard.

> Excellence is not negotiable. It is inevitable.

## Key concepts

- **Portable package** — install Waldemar into pi and carry the same working style across machines.
- **Focused extensions** — commands and behavior stay split into small `extensions/*.ts` entrypoints instead of one monolith.
- **Compact default surface** — specialist tools and skills stay searchable on demand instead of bloating the always-on prompt.
- **Doctor before guesswork** — `/waldemar-doctor` is the authoritative readiness check; `/waldemar-inventory` stays factual.

## What this package provides

- Waldemar's persona and operating doctrine, grounded in [`HERALDRY.md`](HERALDRY.md)
- Focused pi extensions for setup, posture control, status, inventory, doctor, command chamber, system-prompt inspection, and related workflow support
- Packaged themes: `falkensee-heraldry` and `chronicle-keeper`
- Prompt workflows in [`prompts/`](prompts/)
- Custom local skills in [`skills/`](skills/)
- Reused third-party skill bootstrap from [`config/external-skills.json`](config/external-skills.json)
- Native CodeGraph integration plus optional MCP compatibility through `pi-mcp-adapter`
- Bundled third-party `/usage` dashboard from `pi-extensions/usage-extension`

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

If you are preparing a fresh machine, start with [`docs/setup-and-portability.md`](docs/setup-and-portability.md).

## Main commands

Begin with:

```text
/waldemar
```

Common direct commands:

- `/waldemar-setup` — reconcile settings, MCP compatibility config, and external skills
- `/waldemar-doctor` — primary package and machine readiness check
- `/waldemar-status` — lightweight operational status report
- `/waldemar-inventory` — installed packages, MCP servers, and skills
- `/waldemar-tooling [gh|sentry-cli]` — explicit Debian or Ubuntu guidance for required local CLI tools
- `/waldemar-system-prompt` — inspect the captured full system prompt
- `/posture` — choose the active guard posture
- `/chronicle` — record a TUI-only decision or milestone
- `/waldemar-customize` — quick customization map
- `/usage` — interactive usage statistics dashboard bundled from `pi-extensions`

The canonical command roster lives in [`docs/commands.md`](docs/commands.md).

## When should you reach for Waldemar?

Choose Waldemar when you want a personal pi package with strong defaults, visible operating doctrine, durable setup orders, and a maintainable extension layout. If you only need a one-off pi configuration with no shared package structure, plain pi settings may be the simpler path.

## Documentation map

- [`docs/README.md`](docs/README.md) — documentation hub
- [`docs/architecture.md`](docs/architecture.md) — repository layout and design rules
- [`docs/setup-and-portability.md`](docs/setup-and-portability.md) — fresh-machine bootstrap and portability expectations
- [`docs/mcp.md`](docs/mcp.md) — native CodeGraph and MCP compatibility behavior
- [`docs/external-skills.md`](docs/external-skills.md) — third-party skill bootstrap model
- [`docs/customization.md`](docs/customization.md) — where to change tone, setup, skills, prompts, and themes
- [`docs/extensions/README.md`](docs/extensions/README.md) — purpose of each focused extension

## Development rules

This repository is a portable agent package, not a dumping ground. Keep extensions small, keep shared helpers in `lib/`, and update the documentation surface when behavior changes.

- Project rules: [`AGENTS.md`](AGENTS.md)
- Validation guidance: [`VALIDATION.md`](VALIDATION.md)

Recommended validation:

```bash
pi --offline --list-models
bash -n scripts/bootstrap-skills.sh
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
```

## License

MIT. See [`LICENSE`](LICENSE).
