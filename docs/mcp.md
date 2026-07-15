# MCP Servers

Waldemar configures MCP through `pi-mcp-adapter`. The setup command writes MCP servers into `~/.pi/agent/mcp.json`.

## Default servers

### codegraph

```json
{
  "command": "codegraph",
  "args": ["serve", "--mcp"]
}
```

Requires the `codegraph` binary on `PATH`.

### sentry

`/waldemar-setup` writes an absolute path to Waldemar's package-installed Sentry MCP binary:

```json
{
  "command": "<waldemar>/node_modules/.bin/sentry-mcp",
  "args": []
}
```

Sentry MCP requires authentication. Provide the token **before starting pi**:

```bash
export SENTRY_AUTH_TOKEN='sntrys_...'
```

Waldemar reports missing Sentry authentication in both `/waldemar-status` and `/waldemar-inventory`.

## Removed servers

### postgres

Waldemar no longer configures a Postgres MCP server. `/waldemar-setup` removes stale `postgres` entries from `~/.pi/agent/mcp.json` if they were written by an older version of the package.

The external Postgres skill in `config/external-skills.json` is separate from MCP and remains available unless disabled there.

## Changing MCP servers

Edit `WALDEMAR_MCP_SERVERS` in `lib/waldemar.ts`, then run:

```text
/waldemar-setup
/reload
```
