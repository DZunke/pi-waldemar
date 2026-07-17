# Setup and Portability

[Back to docs index](README.md)


Waldemar is intended to make a fresh machine operational quickly.

## Fresh machine flow

```bash
pi install git:github.com/DZunke/pi-waldemar
pi
```

Then inside pi:

```text
/waldemar-setup
/reload
```

## What `/waldemar-setup` does

- writes recommended global pi settings, including the `falkensee-heraldry` theme, medium thinking, command-chamber display polish, compaction, retry, branch-summary, image, and skill-command defaults
- on WSL hosts, enables Waldemar desktop notifications for questions and settled completions by writing `~/.pi/agent/waldemar-notifications.json`
- when the Windows-side BurntToast PowerShell module is missing, notification test and status surfaces report explicit installation guidance instead of failing silently
- preserves existing package entries in global settings
- checks whether the `codegraph` binary is available for the native CodeGraph extension
- writes/merges `~/.pi/agent/mcp.json`
- configures the codegraph MCP compatibility server entry
- removes stale legacy Postgres MCP entries
- runs `scripts/bootstrap-skills.sh` for external skills
- reports progress in the footer while long-running skill installation proceeds
- reports explicit hints for missing machine local CLI tools and points to `/waldemar-tooling`

## What it does not do

- It does not run `npm install` inside Waldemar.
- It does not vendor third-party skills into `skills/`.
- It does not authenticate Sentry CLI for you. Use the Sentry external skills and `sentry-cli` when Sentry work is needed.

## CLI setup flow

When `/waldemar-doctor` or `/waldemar-setup` reports a missing CLI requirement, run one of these explicit guidance commands:

```text
/waldemar-tooling
/waldemar-tooling gh
/waldemar-tooling sentry-cli
```

With no argument, that command shows only the CLI tools that are currently missing. For GitHub CLI it uses the official Debian repository flow recommended by the GitHub CLI maintainers. For Sentry CLI it uses the Debian or Ubuntu npm based install path that matches Waldemar's existing bootstrap assumptions. After completing those orders, rerun `/waldemar-setup`.
