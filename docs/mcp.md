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

### postgres

`/waldemar-setup` writes an absolute path to Waldemar's package-installed postgres MCP binary:

```json
{
  "command": "<waldemar>/node_modules/.bin/mcp-postgres",
  "args": [],
  "env": {
    "DB_READ_ONLY": "true"
  }
}
```

Requires one of these credential styles before starting pi:

```bash
export DATABASE_URL='postgresql://user:password@host:5432/database'
```

or:

```bash
export DB_HOST='localhost'
export DB_PORT='5432'
export DB_USER='postgres'
export DB_PASSWORD='password'
export DB_NAME='database'
```

Waldemar sets `DB_READ_ONLY=true` by default. Still use a least-privilege database user; standards, after all, are not decorative.

### sentry

`/waldemar-setup` writes an absolute path to Waldemar's package-installed Sentry MCP binary:

```json
{
  "command": "<waldemar>/node_modules/.bin/sentry-mcp",
  "args": []
}
```

Usually requires Sentry authentication. Prefer an environment variable:

```bash
export SENTRY_AUTH_TOKEN='sntrys_...'
```

## Changing MCP servers

Edit `WALDEMAR_MCP_SERVERS` in `lib/waldemar.ts`, then run:

```text
/waldemar-setup
/reload
```
