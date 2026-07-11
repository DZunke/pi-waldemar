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

- writes recommended global pi settings
- preserves existing package entries in global settings
- writes/merges `~/.pi/agent/mcp.json`
- configures codegraph, postgres, and sentry MCP servers
- runs `scripts/bootstrap-skills.sh` for external skills
- reports progress in the footer while long-running skill installation proceeds

## What it does not do

- It does not run `npm install` inside Waldemar.
- It does not vendor third-party skills into `skills/`.
- It does not create secrets such as `SENTRY_AUTH_TOKEN` or `POSTGRES_CONNECTION_STRING`.
