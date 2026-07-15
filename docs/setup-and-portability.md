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
- configures codegraph and Sentry's remote OAuth MCP server
- removes stale postgres MCP entries from older Waldemar installations
- runs `scripts/bootstrap-skills.sh` for external skills
- reports progress in the footer while long-running skill installation proceeds

## What it does not do

- It does not run `npm install` inside Waldemar.
- It does not vendor third-party skills into `skills/`.
- It does not complete Sentry OAuth for you; run `/mcp-auth sentry` after setup and reload when you need Sentry MCP access.
