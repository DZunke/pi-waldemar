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

## Bootstrap behaviour

The bootstrap continues when an individual third-party skill fails. This protects `/waldemar-setup` from upstream repository churn.
