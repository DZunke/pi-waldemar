# MCP Servers

Waldemar configures MCP through `pi-mcp-adapter`. The setup command writes Waldemar's MCP defaults into `~/.pi/agent/mcp.json`.

## Waldemar default

### codegraph

```json
{
  "command": "codegraph",
  "args": ["serve", "--mcp"]
}
```

Requires the `codegraph` binary on `PATH`.

Sentry is intentionally **not** configured as MCP. Waldemar uses the Sentry external skills and Sentry CLI instead.

## Footer status: `MCP: X/Y servers`

This footer text is produced by `pi-mcp-adapter`, not by Waldemar's custom footer directly.

Source in the adapter:

```text
node_modules/pi-mcp-adapter/init.ts
```

The adapter computes:

- `Y` from the number of MCP servers in its merged config
- `X` from the number of currently connected MCP server sessions

MCP servers are lazy by default, so `0/Y` can be normal before you use an MCP tool. The count can also include servers from non-Waldemar MCP config files.

`pi-mcp-adapter` reads and merges these locations:

1. `~/.config/mcp/mcp.json`
2. `~/.pi/agent/mcp.json`
3. `.mcp.json`
4. `.pi/mcp.json`

If the footer shows more servers than Waldemar documents, inspect those files. `/waldemar-doctor` reports when additional MCP servers are configured outside Waldemar defaults.

Useful commands:

```text
/mcp
/mcp reconnect codegraph
```

## Changing Waldemar MCP defaults

Edit `WALDEMAR_MCP_SERVERS` in `lib/waldemar.ts`, then run:

```text
/waldemar-setup
/reload
```
