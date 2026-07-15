# External Skills

External skills are reused third-party skills installed with the Skills CLI. They do not live in `skills/`.

## Source of truth

```text
config/external-skills.json
```

Each enabled entry is installed by:

```text
scripts/bootstrap-skills.sh
```

The script uses commands of this form:

```bash
npx -y skills add <source> -g -y -a "*" -s <name>
```

## Custom vs external skills

- Put your own handwritten skills in `skills/`.
- Put reused third-party skills in `config/external-skills.json`.
- Disable an external skill by setting `"enabled": false`.

## Notable enabled skills

- `agent-browser` — browser and desktop automation support.
- `find-skills` — discover additional installable skills.
- `grill-me` — adversarial review and challenge prompts from `mattpocock/skills`.
- `interview-me` — interview-practice prompts from `addyosmani/agent-skills`.
- Sentry, Postgres, pgvector, Azure Foundry, Tabler, and diagramming skills are also declared in `config/external-skills.json`.

## Bootstrap behaviour

The bootstrap continues when an individual third-party skill fails. This protects `/waldemar-setup` from upstream repository churn.
