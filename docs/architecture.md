# Architecture

Waldemar is a portable personal pi-agent package. It bundles persona, commands, themes, reusable setup automation, and documented extension points.

## Layout

```text
waldemar/
├── AGENTS.md                 # Development rules for agents modifying this repo
├── extensions/               # Focused pi extension entrypoints
├── lib/                      # Shared constants, helpers, and types
├── config/                   # Declarative setup data
├── scripts/                  # Bootstrap scripts
├── skills/                   # Custom handwritten Waldemar skills only
├── prompts/                  # Prompt templates
├── themes/                   # Pi themes
└── docs/                     # Package documentation
```

## Extension loading

Pi discovers top-level `extensions/*.ts` files from the package manifest. Because every top-level file is loaded as an extension, helper files must not live there. Put shared code in `lib/`.

## Package dependencies

Third-party pi extensions are declared in `package.json` and referenced in `pi.extensions`. Waldemar currently uses `pi-mcp-adapter` this way. MCP server packages such as `mcp-postgres` and `@sentry/mcp-server` are also package dependencies so `/waldemar-setup` can write stable command paths into `~/.pi/agent/mcp.json`.

Do not run `npm install` from setup commands. Pi should reconcile dependencies for git/npm package installs. A local development install may require a one-time manual `npm install`.
