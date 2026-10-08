# Customization

[Back to docs index](README.md)


## Change Waldemar's tone

- Persona system prompt: `lib/waldemar.ts`
- Prompt section formatting: `lib/system-prompt.ts`
- Persona extension hook: `extensions/persona.ts`

Keep technical clarity and safety above character flavor. `HERALDRY.md` remains the background for Waldemar's identity, while command and extension names should describe their function.

## Change startup and lifecycle status

Edit the concise startup message and lifecycle labels in `extensions/startup-status.ts`.

## Change desktop notification behaviour

- Command surface: `extensions/desktop-notifications.ts`
- Transport and persistence helpers: `lib/notifications.ts`
- One-alert-per-input gate: `lib/notification-gate.ts`
- User preference file: `~/.pi/agent/waldemar-notifications.json`

Use `/waldemar-notifications` to switch between `all`, `questions`, `settled`, `off`, and `test` without editing files. You can also tune the idle gate with `/waldemar-notifications idle <seconds>`, for example `/waldemar-notifications idle 30`. Waldemar sends at most one desktop notification per interactive or RPC user input; another user input re-arms notifications, while extension-generated follow-ups do not.

On WSL, Waldemar prefers Windows toast notifications through the BurntToast PowerShell module. If `/waldemar-notifications test` reports that BurntToast is missing, install it in Windows PowerShell with `Install-Module -Name BurntToast -Scope AllUsers` or `-Scope CurrentUser`.

## Add or change a command

Create a focused file in `extensions/`, for example:

```text
extensions/my-command.ts
```

Each extension file should export a default function accepting `ExtensionAPI`.

When commands are added, removed, or materially changed, update:

- `docs/commands.md` — canonical command roster
- `README.md` — fast user-facing command summary
- `docs/extensions/<extension>.md` — implementation responsibility

## Change tool discovery defaults

- Pi-native default-tool merge: `lib/setup.ts`
- Setup integration: `extensions/machine-setup.ts`

Pi's `tool_search` and `codemode` handle specialist tool discovery and use. Waldemar does not reset active tools to a fixed list; preserve explicit user choices when changing `defaultTools`. There is no Waldemar-owned tool catalog; use Pi's focused discovery tools and package-native surfaces.

Bundled third-party command surfaces should be added through `package.json` dependencies and `pi.extensions` paths, not copied into `extensions/`.

## Add or change a subagent persona

Create or edit a Markdown definition under `agents/` and keep its responsibility, prompt, context inheritance, and tool allowlist explicit. The package exposes that directory through `pi.subagents.agents`; user- and project-scoped definitions can override a packaged role. See [Personas and Subagents](personas-and-subagents.md) before changing role boundaries or model routing.

## Change setup behaviour

- Setup command: `extensions/machine-setup.ts`
- Setup defaults and legacy MCP migration: `lib/setup.ts`
- Shared package paths and persona text: `lib/waldemar.ts`
- External skills list: `config/external-skills.json`
- External skills installer: `scripts/bootstrap-skills.sh`

## Add a prompt workflow

Create a Markdown template in:

```text
prompts/my-workflow.md
```

Use prompt templates for explicit on-demand workflows such as `/write-ticket`. If the workflow grows into a larger reusable method, promote it to a skill. If it needs enforced UI or control flow, promote it to a focused extension command.

See `docs/prompts.md` for the decision flow.

## Add a custom skill

Create:

```text
skills/my-skill/SKILL.md
```

Do not copy third-party skills into this directory unless explicitly choosing to fork and maintain them.

Pi discovers skills from the package and configured skill directories and exposes them through its native skill workflow, including `/skill:<name>`. Keep skill metadata accurate and put detailed workflows in `SKILL.md`; do not duplicate native skill discovery with a Waldemar catalog extension.

## Change the theme

Edit or add files in `themes/`. Packaged themes are:

- `atlavium` — dark leather-toned surfaces, warm parchment text, and gold accents.
- `falkensee-heraldry-light` — a light variant with lake blue, crimson, silver, and restrained gold.
- `falkensee-heraldry` — a dark lake-blue variant with crimson-forward accents, restrained gold, and clear silver.

The default selected by `/waldemar-setup` is `falkensee-heraldry-light/falkensee-heraldry`, allowing Pi to choose the light or dark variant from terminal appearance. To choose a theme manually, set its name in `~/.pi/agent/settings.json` or select it through Pi's `/settings`. If your settings still name the former `chronicle-keeper` theme, select `atlavium` instead.
