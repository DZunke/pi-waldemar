# Setup and Portability

[Back to docs index](README.md)

Waldemar separates package loading from machine setup. Pi loads the extensions, themes, prompts, skills, packaged role agents, and bundled `pi-subagents` dependency when the package is installed; `/waldemar-setup` applies recommended global settings and installs configured external skills. CodeGraph MCP registers automatically through Pi's built-in MCP support when Waldemar loads. Use Pi 1.1.0 or newer for Waldemar's current additive tool defaults and cancellation-aware status.

## Fresh machine flow

```bash
pi install git:github.com/DZunke/pi-waldemar
pi
```

Then inside Pi, run `/waldemar-setup` for the recommended settings and external-skill bootstrap. Run `/reload` or restart Pi if the package dependencies were just reconciled.

## What `/waldemar-setup` does

- writes recommended global Pi settings, including the automatic `falkensee-heraldry-light/falkensee-heraldry` theme pair, medium thinking, display polish, compaction, retry, branch-summary, image, and skill-command defaults
- adds `codemode` and `tool_search` to `defaultTools` without removing other entries or overriding explicit user opt-outs
- on WSL hosts, enables Waldemar desktop notifications for questions and settled completions by writing `~/.pi/agent/waldemar-notifications.json`
- checks whether the `codegraph` binary is available and explains that the extension registration is enabled when the current workspace has a `.codegraph` index
- runs `scripts/bootstrap-skills.sh` for external skills
- reports progress in the footer while long-running skill installation proceeds
- reports explicit hints for missing machine-local CLI tools and points to `/waldemar-tooling`

Setup does not write a new MCP server entry or start an npm install. It removes only the exact CodeGraph default written by older Waldemar setup versions, preserving customized entries and all other servers. Pi manages CodeGraph's MCP process and connection for each session.

## Existing CodeGraph configuration

Older setup versions wrote a `codegraph` server entry to global `mcp.json`. Pi gives a same-named file-configured server precedence over Waldemar's extension registration. `/waldemar-setup` removes only the exact old default; customized entries are left untouched. If you do not run setup, inspect the entry and remove it with `pi mcp remove codegraph` only when you intend to replace it. See [MCP and CodeGraph](mcp.md) for the precedence rules and troubleshooting steps.

## What setup does not do

- It does not run `npm install` inside Waldemar. Pi reconciles package dependencies for git/npm package installs; a local-path development install may require a one-time manual `npm install`.
- It does not vendor third-party skills into `skills/`.
- It does not alter `pi-subagents` role definitions, model overrides, thinking levels, or concurrency preferences; configure those through Pi settings and the `pi-subagents` configuration file.
- It does not authenticate Sentry CLI for you. Use the Sentry external skills and `sentry-cli` when Sentry work is needed.

## CLI setup flow

When `/waldemar-doctor` or `/waldemar-setup` reports a missing CLI requirement, run one of these explicit guidance commands:

```text
/waldemar-tooling
/waldemar-tooling gh
/waldemar-tooling sentry-cli
```

With no argument, that command shows only the CLI tools that are currently missing. For GitHub CLI it uses the official Debian repository flow recommended by the GitHub CLI maintainers. For Sentry CLI it uses the Debian or Ubuntu npm-based install path that matches Waldemar's existing bootstrap assumptions. After completing the installation steps, rerun `/waldemar-setup`.
