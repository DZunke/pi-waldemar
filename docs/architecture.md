# Architecture

[Back to docs index](README.md)


Waldemar is a portable personal pi-agent package. It bundles persona, commands, themes, reusable setup automation, and documented extension points.

## Layout

```text
waldemar/
├── AGENTS.md                 # Development rules for agents modifying this repo
├── extensions/               # Focused pi extension entrypoints
├── lib/                      # Shared constants, helpers, and types
├── config/                   # Declarative setup data
├── scripts/                  # Bootstrap scripts
├── agents/                   # Packaged role-specific child-agent definitions
├── skills/                   # Custom handwritten Waldemar skills only
├── prompts/                  # Prompt templates
├── themes/                   # Pi themes
└── docs/                     # Package documentation
```

## Extension loading

Pi discovers top-level `extensions/*.ts` files from the package manifest. Because every top-level file is loaded as an extension, helper files must not live there. Put shared code in `lib/`.

## Package dependencies

Third-party Pi extensions are declared in `package.json` and referenced through `pi.extensions`. Waldemar bundles the `/usage` dashboard from `pi-extensions/usage-extension` and the `pi-subagents` runtime from `node_modules/pi-subagents`. Role definitions in `agents/` are exposed through `pi.subagents.agents`; user and project definitions can override package roles. Optional upstream prompt and skill catalogs are not exposed, keeping the package's workflow surface deliberate. MCP itself remains Pi-native rather than using a bundled adapter. `extensions/codegraph.ts` registers `codegraph serve --mcp` for indexed workspaces, and `/waldemar-setup` does not write MCP configuration. Sentry access is handled by external skills and the Sentry CLI, not MCP.

Do not run `npm install` from setup commands. Pi should reconcile dependencies for git/npm package installs. A local development install may require a one-time manual `npm install`.
