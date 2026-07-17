# codegraph.ts

Purpose: register native CodeGraph tools when the current workspace already has a `.codegraph` index.

Responsibilities:

- detect whether the workspace is indexed for CodeGraph
- start and manage a local `codegraph serve --mcp` subprocess without requiring global MCP configuration
- register discovered `codegraph_*` tools directly with pi
- append concise CodeGraph usage guidance into the system prompt before each agent turn
- tear down the subprocess cleanly on session shutdown and process exit

Implementation notes:

- Shared process and RPC handling live in `lib/codegraph.ts`.
- The extension is intentionally quiet when no `.codegraph` directory exists in the workspace.
- MCP compatibility remains documented in `docs/mcp.md`, but the native extension is the primary CodeGraph path for Waldemar.
