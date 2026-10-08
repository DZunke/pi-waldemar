# codegraph.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: register CodeGraph through Pi's built-in MCP support whenever Waldemar loads, then enable the server only for workspaces with a `.codegraph` index.

Responsibilities:

- registers `codegraph serve --mcp` with `pi.registerMcpServer()` and the current workspace as its working directory
- uses Pi's `codemode` exposure so specialist MCP tools are discovered on demand instead of flooding the default tool list
- contributes concise CodeGraph guidance through `before_agent_start` structured system-prompt sections
- keeps the server registered but disabled when the current workspace has no `.codegraph` index

`lib/codegraph.ts` owns the index check and server configuration. No subprocess or JSON-RPC client is maintained by Waldemar; Pi manages the MCP process, connection, tools, and lifecycle. The integration requires Pi 0.99 or newer, which provides native extension-registered MCP servers.

A server with the same name in Pi's MCP configuration takes precedence over an extension registration. Use `/mcp` to inspect the effective server and connection state. See [`../mcp.md`](../mcp.md) for setup, precedence, and troubleshooting details.
