# Setup and Portability

Waldemar is intended to make a fresh machine operational quickly.

## Fresh machine flow

```bash
pi install git:github.com/yourusername/waldemar
pi
```

Then inside pi:

```text
/waldemar-setup
/reload
```

## What `/waldemar-setup` does

- writes recommended global pi settings, including the `falkensee-heraldry` theme
- preserves existing package entries in global settings
- writes/merges `~/.pi/agent/mcp.json`
- configures the codegraph MCP server
- runs `scripts/bootstrap-skills.sh` for external skills
- reports progress in the footer while long-running skill installation proceeds

## What it does not do

- It does not run `npm install` inside Waldemar.
- It does not vendor third-party skills into `skills/`.
- It installs Sentry CLI tooling through the external `sentry-cli` skill post-install, but it does not authenticate Sentry for you. Use `sentry-cli login` when needed.
