# External Skills

[Back to docs index](README.md)


External skills are reused third-party skills installed by Waldemar's bootstrap script. They do not live in `skills/`.

## Source of truth

```text
config/external-skills.json
```

Each enabled entry is installed by:

```text
scripts/bootstrap-skills.sh
```

The script supports two installers:

```bash
# Default installer: Skills CLI
npx -y skills add <source> -g -y -a "*" -s <name>

# GitHub skill installer, for repositories that no longer expose skills through the Skills CLI
gh skill install <source> <name> --agent pi --scope user --force
```

## Custom vs external skills

- Put your own handwritten skills in `skills/`.
- Put reused third-party skills in `config/external-skills.json`.
- Disable an external skill by setting `"enabled": false`.
- Keep skill descriptions concise and searchable; detailed workflows belong in `SKILL.md` and are loaded on demand through `waldemar_skill_catalog` instead of being fully listed in every system prompt.

## Notable enabled skills

- `agent-browser` — browser and desktop automation support.
- `find-skills` — discover additional installable skills.
- `grill-me` — adversarial review and challenge prompts from `mattpocock/skills`.
- `interview-me` — interview-practice prompts from `addyosmani/agent-skills`.
- `gh-cli` — installed from `github/awesome-copilot` through `gh skill install`.
- `sentry-cli` — installs the Sentry CLI through post-install commands.
- Sentry, Postgres, pgvector, and Tabler skills are also declared in `config/external-skills.json`.

## Bootstrap behaviour

The bootstrap continues when an individual third-party skill fails. This protects `/waldemar-setup` from upstream repository churn.

`gh-skill` entries require the GitHub CLI with the `skill` command available. If `gh` is missing, the bootstrap records a warning and continues.

## CLI prerequisites

Some external skills depend on machine local CLI tools beyond the skill files themselves.

- `gh-cli` depends on GitHub CLI with `gh skill install` available.
- `sentry-cli` depends on the Sentry CLI binary plus local authentication.

Use `/waldemar-tooling` for explicit install, verification, and follow up setup orders for each supported CLI tool. The doctor report now points there when a required command is missing.
