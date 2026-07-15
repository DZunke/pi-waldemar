# Waldemar Quick Start

Install and activate **Waldemar of Falkensee**, your personal Pi coding agent package.

## Prerequisites

- Pi coding agent installed and available as `pi`
- Node/npm available for local development installs
- Optional: `codegraph` on `PATH` for the codegraph MCP server

## Install

Choose one path.

### Local development checkout

Use this when working directly from `~/.pi/waldemar`:

```bash
cd ~/.pi/waldemar
npm install --omit=dev
pi install ~/.pi/waldemar
```

### Git package

Use this on another machine or after pushing the package repository:

```bash
pi install git:github.com/DZunke/pi-waldemar
```

### Test without installing

```bash
pi -e ~/.pi/waldemar
```

## First run

Start Pi, then run Waldemar setup inside the session:

```text
/waldemar-setup
/reload
```

Setup applies the Falkensee theme/settings, reconciles external skills, writes MCP configuration, and removes stale legacy Postgres MCP entries.

## Optional: authenticate Sentry MCP

Waldemar uses Sentry's remote OAuth MCP server, not a local Node Sentry MCP package.

After `/waldemar-setup` and `/reload`, authenticate when you want Sentry tools available:

```text
/mcp-auth sentry
```

For remote/headless sessions, use the adapter proxy flow instead:

```js
mcp({ action: "auth-start", server: "sentry" })
```

Then complete with the redirected URL:

```js
mcp({ action: "auth-complete", server: "sentry", args: '{"redirectUrl":"http://localhost:..."}' })
```

## Core commands

| Command | Purpose |
|---------|---------|
| `/waldemar` | Open the command chamber |
| `/waldemar-setup` | Apply settings, skills, and MCP configuration |
| `/waldemar-status` | Show lightweight operational status |
| `/waldemar-inventory` | Inspect packages, MCP servers, and installed skills |
| `/waldemar-customize` | Show customization guidance |
| `/sessions` | List past campaign sessions |
| `/resume <path>` | Resume a saved session |
| `/posture forge` | Switch to a deeper implementation posture |
| `/chronicle "note"` | Record a campaign milestone |
| `/reload` | Reload after package changes |

See `docs/commands.md` for the full command roster.

## Customize

Edit the package files, then run `/reload` in Pi.

| Path | Purpose |
|------|---------|
| `extensions/` | Pi extension entrypoints and commands |
| `lib/` | Shared Waldemar helpers and constants |
| `skills/` | Custom handwritten Waldemar skills |
| `config/external-skills.json` | Reused third-party skill declarations |
| `scripts/bootstrap-skills.sh` | External skill installer |
| `themes/` | Visual themes |
| `prompts/` | Prompt templates |
| `docs/` | Durable package documentation |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Waldemar does not load | Run `pi install ~/.pi/waldemar`, then restart Pi |
| Changes do not appear | Run `/reload` inside Pi |
| MCP state looks wrong | Run `/waldemar-setup`, then `/reload` |
| Sentry tools need login | Run `/mcp-auth sentry` |
| You need the complete docs | Start with `README.md` and `docs/README.md` |

The line is ordered. The work shall be worthy.
