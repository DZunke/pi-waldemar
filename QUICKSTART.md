# Waldemar Quickstart

Use this when you want to install and start using Waldemar of Falkensee.

## Install

```bash
pi install git:github.com/DZunke/pi-waldemar
```

Start Pi:

```bash
pi
```

## First setup

Inside Pi, run:

```text
/waldemar-setup
/reload
```

Setup applies Waldemar's recommended settings, theme, external skills, and Codegraph MCP configuration. It also reports any missing local requirements.

## Use Waldemar

Open the command chamber:

```text
/waldemar
```

Check readiness if something feels missing:

```text
/waldemar-doctor
```

Inspect what is installed:

```text
/waldemar-inventory
```

## Common commands

| Command | Use |
|---------|-----|
| `/waldemar` | Open the command chamber |
| `/waldemar-setup` | Apply Waldemar settings, skills, and Codegraph MCP config |
| `/waldemar-doctor` | Check readiness and missing requirements |
| `/waldemar-status` | Show lightweight operational status |
| `/waldemar-inventory` | List packages, MCP servers, and skills |
| `/sessions` | List past sessions |
| `/resume <path>` | Resume a saved session |
| `/posture forge` | Switch to deeper implementation mode |
| `/reload` | Reload after setup or package changes |

## Notes

- Waldemar configures **Codegraph MCP only**.
- Sentry support is handled through external Sentry skills and the Sentry CLI, not MCP.
- Full documentation starts at `README.md` and `docs/README.md`.

The line is ordered. The work shall be worthy.
