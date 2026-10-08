# package-inventory.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)

Purpose: register `/waldemar-inventory`, a factual snapshot of package and machine configuration.

The inventory reports packages and MCP servers from global settings, workspace MCP configuration, servers registered by extensions, packaged and user-level skills, and Waldemar's CodeGraph registration. Pi's `/mcp` remains authoritative for effective connection, authentication, and server status because Pi can load configuration from sources this summary does not inspect.

Implementation lives in `extensions/package-inventory.ts` and `lib/inventory.ts`. It reads global settings and MCP configuration from `~/.pi/agent/`, workspace MCP configuration from `<workspace>/.pi/mcp.json`, and skills from the package and two user-level skill directories. It does not judge readiness; use `/waldemar-doctor` for that.
