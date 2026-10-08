# Validation and Readiness

This page records repeatable package checks and the evidence they provide. It is not a claim that every machine-local prerequisite is installed; `/waldemar-doctor` is the single runtime readiness authority.

## Supported Pi API

Waldemar's current defaults and cancellation-aware status use Pi 1.1.0 or newer. Pi's built-in MCP registration API first appeared in 0.99.0; Pi 1.1.0 adds the `+name`/`-name` `defaultTools` syntax used by setup and `agent_settled.aborted` used by presence reporting. Validate against the Pi host that will load the package; a local development copy of the Pi type package may not match the active CLI version.

## Repeatable checks

Run from the repository root:

```bash
npm test
pi --offline -e . --list-models
for theme in falkensee-heraldry-light falkensee-heraldry atlavium falkensee-heraldry-light/falkensee-heraldry; do pi --offline -e . --use-theme "$theme" --list-models >/dev/null; done
bash -n scripts/bootstrap-skills.sh
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"
node -e "for (const f of require('fs').readdirSync('themes').filter(f => f.endsWith('.json'))) JSON.parse(require('fs').readFileSync('themes/'+f,'utf8'))"
git diff --check
```

`npm test` verifies the extension roster and documentation coverage, bundled `pi-subagents` resources and role definitions, the package manifest without `pi-mcp-adapter`, the light/dark theme role match, CodeGraph's Pi-native server configuration and index gate, structured prompt-section updates, additive tool defaults, and safe migration of only the exact old CodeGraph entry. The Pi CLI smoke checks load the package and its themes through the active host runtime; they are not a standalone TypeScript compiler check. Interactive TUI surfaces should also be checked manually in both the default fullscreen mode and `pi --tui-mode regular -e .`: switch themes through Pi's `/settings`, inspect the system-prompt viewer, and cancel a run to confirm the cancelled status.

## Runtime readiness rules

- `/waldemar-doctor` owns readiness judgments, including whether CodeGraph is registered and whether the `codegraph` binary is available when the current workspace has an index.
- `/waldemar-inventory` reports configuration and discovered resources as facts; Pi's `/session` reports current-session details.
- A missing CodeGraph index keeps the extension-registered server disabled unless a same-named file-configured MCP server overrides it. Create the index and reload Pi to enable the extension registration.
- A same-named file-configured MCP server takes precedence over Waldemar's extension registration. Inspect `/mcp` before changing existing MCP configuration.
- Missing optional CLI tools and external skills should be reported with actionable guidance, not treated as evidence that the package itself failed to load.

## Current package surface

- 10 focused extension entrypoints under `extensions/`, each with a purpose page under `docs/extensions/`.
- 6 Waldemar commands, plus the bundled `/usage` dashboard and `pi-subagents` commands.
- 3 packaged role agents: Jessica, Brunhilde Nordwald, and Albert Metzler.
- 3 packaged themes: `falkensee-heraldry-light`, `falkensee-heraldry`, and `atlavium`.
- 4 handwritten skills and 2 prompt templates.
- Pi-native MCP, `tool_search`, `codemode`, and skill discovery; Waldemar does not include a custom MCP adapter or duplicate tool/skill catalogs.

## Portability notes

- Pi reconciles third-party package dependencies for git/npm installs. A local-path development install may need a one-time manual `npm install`; setup does not run it.
- `/waldemar-setup` applies recommended global Pi settings and bootstraps configured external skills. CodeGraph registration occurs when Waldemar loads and does not depend on setup.
- Theme and MCP behavior should be checked against the active Pi release. `docs/setup-and-portability.md` and `docs/mcp.md` are the canonical operational references.
