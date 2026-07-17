# MCP Servers

[Back to docs index](README.md)


Waldemar uses CodeGraph natively when the current workspace contains a `.codegraph` index. The package still carries `pi-mcp-adapter` for general MCP compatibility, and `/waldemar-setup` writes a CodeGraph MCP entry into `~/.pi/agent/mcp.json` for users who still rely on `/mcp` flows.

## Primary path: native CodeGraph extension

When `.codegraph` exists in the workspace root, `extensions/codegraph.ts`:

- starts a local `codegraph serve --mcp` subprocess directly
- registers the discovered `codegraph_*` tools with pi
- appends CodeGraph usage guidance into the agent system prompt
- tears the subprocess down on session shutdown

This means Waldemar is no longer CodeGraph through MCP only. The agent can use CodeGraph even if no global MCP config is present.

Waldemar keeps specialist tools behind `waldemar_tool_catalog` by default. Native CodeGraph or MCP tools can be installed and registered without forcing every tool name into the system prompt; the agent searches and enables specialist tools when the task calls for them.

## Compatibility path: Waldemar MCP default

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

Useful commands when you are using MCP compatibility flows:

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
