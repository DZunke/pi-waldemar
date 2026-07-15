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

Waldemar uses Sentry's **remote MCP server**, not a local Node MCP package:

```json
{
  "url": "https://mcp.sentry.dev/mcp",
  "auth": "oauth"
}
```

Authenticate through `pi-mcp-adapter` after setup and reload:

```text
/waldemar-setup
/reload
/mcp-auth sentry
```

For remote/headless sessions, use the MCP proxy OAuth flow:

```js
mcp({ action: "auth-start", server: "sentry" })
```

Then open the returned URL locally and complete the flow with the redirected URL:

```js
mcp({ action: "auth-complete", server: "sentry", args: '{"redirectUrl":"http://localhost:..."}' })
```

Waldemar reports whether Sentry is configured as the remote OAuth MCP in both `/waldemar-status` and `/waldemar-inventory`.

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
