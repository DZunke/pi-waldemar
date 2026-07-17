# skill-catalog.ts

[Back to extension index](README.md) · [Back to docs index](../README.md)


Purpose: keep the system prompt from carrying the full installed skill roster while preserving model access to skill workflows.

Responsibilities:

- register `waldemar_list_skills` as the complete installed-skill overview tool
- register `waldemar_skill_catalog` as the searchable skill-discovery and loading tool
- replace pi's verbose `<available_skills>` prompt block with a short Skill Discovery section before each agent turn
- search installed skills by name, source, path, or description
- return a full installed skill overview through `waldemar_list_skills`
- keep `listAll: true` on `waldemar_skill_catalog` as a broad search fallback, not as the primary overview path
- load selected `SKILL.md` files on demand so the agent can follow exact instructions only when needed
- preserve the Agent Skills rule that relative paths inside a loaded skill resolve against that skill's base directory

Implementation notes:

- Prompt compaction and catalog behavior live in `lib/skill-catalog.ts`.
- The catalog does not uninstall or hide skills from slash-command use; it only keeps their full descriptions and paths out of the always-on system prompt.
- `waldemar_skill_catalog` returns loaded skill content only for exact requested skill names.
- If the agent needs reconnaissance of every installed skill, it should call `waldemar_list_skills`.
- Keep the always-on prompt wording short. Durable workflow detail belongs in the skill files themselves.
