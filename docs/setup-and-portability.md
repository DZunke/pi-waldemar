# Setup and Portability

Waldemar is intended to make a fresh machine operational quickly.

## Fresh machine flow

```bash
pi install git:github.com/DZunke/pi-waldemar
pi
```

Then inside pi:

```text
/waldemar-setup
/reload
```

## What `/waldemar-setup` does

- writes recommended global pi settings, including the `falkensee-heraldry` theme, medium thinking, command-chamber display polish, compaction, retry, branch-summary, image, and skill-command defaults
- preserves existing package entries in global settings
- writes/merges `~/.pi/agent/mcp.json`
- configures the codegraph MCP server
- removes stale legacy Postgres MCP entries
- runs `scripts/bootstrap-skills.sh` for external skills
- reports progress in the footer while long-running skill installation proceeds

## What it does not do

- It does not run `npm install` inside Waldemar.
- It does not vendor third-party skills into `skills/`.
- It does not authenticate Sentry CLI for you. Use the Sentry external skills and `sentry-cli` when Sentry work is needed.
