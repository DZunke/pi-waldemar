# tool-catalog.ts

Purpose: keep Waldemar's active tool surface compact while preserving access to installed specialist tools.

Responsibilities:

- register `waldemar_list_tools` as the complete installed-tool overview tool
- register `waldemar_tool_catalog` as the search and activation tool
- keep core coding tools active by default: read/search, shell, edit/write, MCP gateway, and the catalog itself
- search all installed tools by name, source, or description
- return a full installed-tool overview through `waldemar_list_tools`
- keep `listAll: true` on `waldemar_tool_catalog` as a broad search fallback, not as the primary overview path
- enable selected non-core tools on demand for the following agent step
- prevent the system prompt from becoming a long roster of every installed MCP, package, or integration tool

Implementation notes:

- Tool-selection policy lives in `lib/tool-catalog.ts`.
- The catalog changes active tools with `pi.setActiveTools()`, not by uninstalling or unregistering tools.
- If a specialized tool is needed, the agent should call `waldemar_tool_catalog` with a search query, then call it again with exact tool names in `enable`.
- If the agent needs reconnaissance of the whole installed arsenal, it should call `waldemar_list_tools`.
- Keep the catalog prompt snippet short; the full installed tool roster belongs behind the tool search result, not in the system prompt.
