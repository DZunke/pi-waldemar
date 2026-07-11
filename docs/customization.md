# Customization

## Change Waldemar's tone

- Persona system prompt: `lib/waldemar.ts`
- Persona extension hook: `extensions/persona.ts`

Keep technical clarity and safety above theatrical flavour.

## Change footer status moods

Edit `WALDEMAR_STATUS_MOODS` in `extensions/startup.ts`.

## Add a command

Create a focused file in `extensions/`, for example:

```text
extensions/my-command.ts
```

Each extension file should export a default function accepting `ExtensionAPI`.

## Change setup behaviour

- Setup command: `extensions/setup.ts`
- Shared setup constants: `lib/waldemar.ts`
- External skills list: `config/external-skills.json`
- External skills installer: `scripts/bootstrap-skills.sh`

## Add a custom skill

Create:

```text
skills/my-skill/SKILL.md
```

Do not copy third-party skills into this directory unless explicitly choosing to fork and maintain them.

## Change the theme

Edit or add files in `themes/`. The default theme is selected by `/waldemar-setup` via the `theme` setting.
