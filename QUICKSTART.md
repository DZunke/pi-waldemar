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

Setup applies Waldemar's recommended defaults and reports any missing local requirements.

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
| `/waldemar-setup` | Apply Waldemar's recommended defaults |
| `/waldemar-doctor` | Check readiness and missing requirements |
| `/waldemar-status` | Show lightweight operational status |
| `/waldemar-inventory` | Show what Waldemar can see on this machine |
| `/sessions` | List past sessions |
| `/resume <path>` | Resume a saved session |
| `/posture forge` | Switch to deeper work mode |
| `/reload` | Reload after setup or package changes |

## More information

For the full command roster and detailed documentation, start with `README.md` and `docs/README.md`.

The line is ordered. The work shall be worthy.
