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

Sentry is intentionally **not** configured as MCP. Waldemar uses the Sentry external skills and Sentry CLI instead.

## Changing MCP servers

Edit `WALDEMAR_MCP_SERVERS` in `lib/waldemar.ts`, then run:

```text
/waldemar-setup
/reload
```
