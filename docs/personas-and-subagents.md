# Personas and Subagents

Waldemar is the lead developer and coordinator; specialist personas run as separate Pi child-agent sessions through the bundled `pi-subagents` extension. Keeping the lead persona in the parent session and the specialist prompts in `agents/` lets each role stay distinct while Waldemar retains responsibility for user intent, integration, and final QA.

## Who owns what?

| Role | Responsibility | Access boundary |
| --- | --- | --- |
| Waldemar | Clarify the goal, assign bounded work, resolve tradeoffs, integrate results, and validate the final change. | Parent session; owns final acceptance. |
| Jessica | Review UI clarity, interaction, accessibility, responsive behavior, and visual consistency. | Read-only project inspection; returns a design handoff. |
| Brunhilde Nordwald | Explore the repository or implement a small, clearly scoped task. | Write-capable, including Bash for focused checks; instructed not to commit, push, or change global configuration. |
| Albert Metzler | Clarify the product problem, scope, non-goals, acceptance criteria, and tradeoffs. | Read-only project inspection; returns a product brief. |

The definitions live in `agents/jessica.md`, `agents/brunhilde-nordwald.md`, and `agents/albert-metzler.md`. Their names, prompts, tool allowlists, and `advertise: true` metadata are packaged through `pi.subagents.agents`. User- and project-scoped agents can override package agents with the same name.

## Where do I author their personas?

Edit the Markdown body beneath the YAML frontmatter in the matching `agents/*.md` file; keep the frontmatter intact unless you mean to change tools, context boundaries, or other runtime metadata. The body is the child's separate system prompt, so add each character's identity, voice, temperament, values, and relationship to the realm there. These are Pi agent definitions, not TypeScript persona extensions: `extensions/persona.ts` supplies Waldemar's parent-session identity and does not get inherited by the children.

Children report to Waldemar by default; they do not chat directly or share each other's transcripts. Waldemar can mediate a handoff by passing one agent's findings to another. His prompt now directs him to label contributions by persona and role, distinguish their observations from his synthesis, and surface material disagreements. That gives you provenance without pretending the personas have literal private emotions.

## How do I delegate?

Name a role when you want direct control, or let Waldemar apply the package's standing policy: delegate nontrivial bounded work when specialization or independent work earns the overhead, but keep trivial tasks direct. Call the `subagent` tool after Pi exposes it. A useful brief names the files, success criteria, and validation explicitly:

```js
subagent({
  agent: "brunhilde-nordwald",
  task: "Trace CodeGraph registration through extensions/codegraph.ts and lib/codegraph.ts, verify the indexed-workspace gate with the focused tests, and report findings without changing unrelated files."
})
```

Use `/subagents` to inspect or manage agents, `/subagents-fleet` to monitor active work, `/subagents-doctor` for diagnostics, and `/subagents-guide agents` for the installed version's full agent reference. Pi's `/resume` and `/session` remain the session-management surfaces; Waldemar no longer duplicates them.

For useful handoffs, include the objective, repository/worktree, allowed files, hard constraints, acceptance criteria, validation command, and expected report. Keep parallel writers on disjoint files or isolated worktrees. A child result is evidence, not approval: Waldemar should review the diff and own integration, tests, and final acceptance.

## How do the prompts stay separate?

Each packaged role uses a fresh context, inherits project instructions but not global agent instructions, disables ambient extensions, and receives only its declared tools. These boundaries prevent a background child from accidentally loading Waldemar's persona extension and avoid granting every role the same capabilities. Jessica and Albert are read-only; Brunhilde has a narrow editing tool set. None of the profiles enables nested delegation or MCP access by default.

Tool allowlists reduce capability, but they are not an operating-system sandbox. Brunhilde's Bash and write tools make its no-commit/no-destructive-action rules prompt instructions, not hard enforcement; use it only in trusted workspaces. A worktree limits repository edit scope but does not contain arbitrary shell side effects, so use host-level command controls or an OS sandbox when stronger enforcement is needed.

If a role later needs a specialist provider, add only that provider and its required tool names to that agent's definition or a scoped override. For example, CodeGraph access should be limited to roles that need it and indexed workspaces; see [MCP and CodeGraph](mcp.md). Avoid broad ambient-extension access just to make one tool available.

## How should models and concurrency map from Codex?

The Codex configuration is a routing preference, not a Pi configuration source: it uses Astra Max for coordination, Luna Max as the default subagent, Sol Max for medium tasks, and up to eight concurrent threads. Pi does not import those values automatically. The package deliberately leaves model IDs and concurrency out of the role files so the same personas work with other providers and your user settings remain authoritative.

If you want Pi subagents to default to Luna Max, configure `subagents.defaultModel` and `subagents.defaultThinking` in `~/.pi/agent/settings.json`; use a per-run `model` override or `subagents.agentOverrides` when a medium task merits Sol. Astra's coordination and complex-work tier maps to Waldemar's parent role, but Pi's parent model remains whatever your Pi settings select; there is no need to spawn a child just to reproduce the coordinator tier. See the upstream [model configuration guide](https://github.com/nicobailon/pi-subagents/blob/main/docs/models.md).

Pi-subagents' `parallel.concurrency` defaults to four and `parallel.maxTasks` to eight in `~/.pi/agent/extensions/subagent/config.json`. Raising the workflow concurrency to eight is possible, but it is not a one-to-one global thread cap: active async runs, nested launches, provider limits, and cost are separate concerns. Waldemar setup does not change these settings. Start conservatively, monitor `/subagents-fleet`, and raise limits only when the workload justifies the added parallelism.

## What should evolve later?

Add a persona when it has a distinct decision domain, reliable output contract, and intentionally chosen tools; do not create a new character for a model tier alone. Keep role prompts version-controlled, avoid persistent per-agent memory until its retention and correction policy is clear, and use worktree isolation before running concurrent writers on overlapping code. These checks keep the roster useful rather than ceremonial.

For implementation details, see [the bundled extension purpose page](extensions/subagents.md), upstream [agent definitions](https://github.com/nicobailon/pi-subagents/blob/main/docs/agents.md), [workflows](https://github.com/nicobailon/pi-subagents/blob/main/docs/workflows.md), and [configuration](https://github.com/nicobailon/pi-subagents/blob/main/docs/configuration.md).
