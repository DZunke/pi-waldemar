# CodeGraph and MCP

[Back to docs index](README.md)

Waldemar registers CodeGraph through Pi's built-in Model Context Protocol (MCP) support. This keeps process management, authentication, tool exposure, and connection status in Pi rather than duplicating those responsibilities in a Waldemar adapter.

## What loads automatically?

`extensions/codegraph.ts` calls `pi.registerMcpServer("codegraph", config)` whenever Waldemar loads. It points Pi at `codegraph serve --mcp`, sets the working directory to the current workspace, and uses `codemode` exposure so the full CodeGraph tool list does not crowd the model's default tool declarations.

The registration is present even when a workspace is not indexed, but its `enabled` state is false until `.codegraph` exists in the current workspace. If you create an index while Pi is already running, use `/reload` or restart the session so the extension can update the registration.

`/waldemar-setup` is not required to configure this server. Setup reconciles Pi settings and bootstraps external skills; it does not write `mcp.json`. Pi 0.99.0 or newer is required for extension-registered MCP servers.

## How do I find CodeGraph tools?

Waldemar's setup adds Pi's `codemode` and `tool_search` to `defaultTools` without removing other tools or overriding an explicit user opt-out. CodeGraph uses `codemode` exposure, which lets Pi discover tools on demand instead of declaring the whole server's tool set in every request.

Use Pi's `tool_search` to load a focused tool for the next model call, or use `codemode` to compose or parallelize CodeGraph queries. The prompt guidance contributed by `extensions/codegraph.ts` recommends `codegraph_explore` for structural comprehension, `codegraph_search` for symbols, and the relevant node/callers/callees/impact tools for focused follow-up. Pi exposes server tools under names such as `mcp__codegraph__<tool>`; use the server namespace that Pi reports if a tool name differs.

Pi can automatically activate `codemode` when an enabled server uses `codemode` exposure, and Waldemar setup also adds `codemode` to `defaultTools` unless you have explicitly opted out. To keep the server registered without activating `codemode`, set `"autoEnableCodemode": false` in MCP configuration and exclude `codemode` from `defaultTools`. `tool_search` can still discover tools when it remains enabled. Pi's `/mcp` remains the authority for connection and exposure controls.

## How do I inspect or troubleshoot the server?

Inside a running session, use `/mcp` to inspect the effective server, see whether it is connected, and review tools and errors. `/waldemar-inventory` reports Waldemar's extension registration alongside global and workspace MCP configuration. `/waldemar-doctor` checks the registration and verifies the `codegraph` binary when the current workspace has an index.

If the server does not connect:

1. Confirm the current workspace contains `.codegraph`.
2. Run `codegraph --version` in a shell available to Pi.
3. Run `/reload` or restart Pi after creating the index or changing the binary.
4. Inspect the connection error in `/mcp`.

The native server is managed by Pi, so Waldemar does not spawn a subprocess or implement JSON-RPC itself.

The packaged persona agents do not load ambient extensions or MCP tools by default. This keeps child roles separate from Waldemar's persona and limits each launch to its declared capabilities. If a specialist genuinely needs CodeGraph, configure that role to load the CodeGraph extension and select its `mcp:codegraph` tools; only do so for indexed workspaces, since an unavailable required tool can prevent a child from starting. See [Personas and Subagents](personas-and-subagents.md) for the role boundary and upstream agent configuration reference.

## What if `mcp.json` already defines CodeGraph?

A file-configured server with the same name takes precedence over an extension registration. Earlier versions of `/waldemar-setup` may have written a global `codegraph` entry to `~/.pi/agent/mcp.json`, which overrides the workspace-aware extension registration.

`/waldemar-setup` removes only the exact old Waldemar default and preserves customized entries. If you do not run setup, inspect the entry before changing it; use `pi mcp remove codegraph` only when you intend to replace that file-configured server. Project MCP configuration can also override a global entry; `/mcp` shows the effective source.

`pi mcp list` is useful for file-configured servers, but shell commands do not load extensions. Use the in-session `/mcp` view to inspect Waldemar's extension-registered server.

## References

- [Pi MCP documentation](https://github.com/earendil-works/pi/blob/main/docs/mcp.md) — configuration, exposure, connection management, and extension registration.
- [Model Context Protocol](https://modelcontextprotocol.io) — protocol overview and specification.
- Implementation: `extensions/codegraph.ts`, `lib/codegraph.ts`, and `extensions/machine-setup.ts`.
