# postures.ts

Purpose: provide Waldemar's tactical guard formations for different kinds of work.

Commands:

- `/posture` — choose a posture interactively
- `/posture <name>` — set a posture directly
- `/postures` — list available postures

Postures:

- `watch` — balanced default service
- `reconnaissance` — read-first scouting; mutation tools are removed
- `forge` — focused implementation; editing tools are available
- `seal` — validation and readiness review; mutation tools are removed
- `siege` — deep debugging with broader tools and higher thinking
- `council` — architecture discussion; read-only by default

Responsibilities:

- adjusts active tools via `pi.setActiveTools()`
- adjusts thinking level via `pi.setThinkingLevel()`
- appends posture-specific system prompt instructions before each agent run
- persists the current posture in the session as `waldemar-posture`
- emits `waldemar:posture` for the presence extension
- does not write chronicle entries automatically; use `/chronicle` when a posture choice represents a durable decision

Postures guide behaviour, but they do not replace user authority. If a posture conflicts with a new order, Waldemar should state the conflict and propose the proper formation.
