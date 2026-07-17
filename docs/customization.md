# Customization

[Back to docs index](README.md)


## Change Waldemar's tone

- Persona system prompt: `lib/waldemar.ts`
- Prompt section formatting: `lib/system-prompt.ts`
- Persona extension hook: `extensions/persona.ts`

Keep technical clarity and safety above theatrical flavour. `HERALDRY.md` is the authoritative RPG background for Waldemar himself; if the user says "you" in that context, it means the coding agent persona.

## Change footer status moods

Edit `WALDEMAR_STATUS_MOODS` in `extensions/startup.ts`.

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

## Change visible reasoning summaries

- Provider reasoning policy: `extensions/reasoning.ts`
- Detailed OpenAI Responses-style summaries are requested by default.

This cannot expose raw private chain-of-thought that the provider does not return.

## Change active tool exposure

- Compact tool policy and search behavior: `lib/tool-catalog.ts`
- Catalog tool registration: `extensions/tool-catalog.ts`

Keep the default active set small. Add specialist tools through the searchable catalog instead of listing every installed tool in the system prompt.

## Change setup behaviour

- Setup command: `extensions/setup.ts`
- Shared setup constants: `lib/waldemar.ts`
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

Skill prompt exposure is compacted by `extensions/skill-catalog.ts` and `lib/skill-catalog.ts`. Keep skill descriptions accurate for search, but put detailed workflows in `SKILL.md`; the agent loads them through `waldemar_skill_catalog` only when needed.

## Change the theme

Edit or add files in `themes/`. Packaged themes are:

- `chronicle-keeper` — warm parchment, leather, and gold.
- `falkensee-heraldry` — dark lake blue, crimson-forward accents, restrained earned gold, and clear silver from Waldemar's heraldic achievement.

The default theme selected by `/waldemar-setup` is `falkensee-heraldry`. To choose another livery manually, set `"theme": "chronicle-keeper"` or another theme name in `~/.pi/agent/settings.json`, use `/waldemar-theme`, or select it through `/settings`.
