import type { ExtensionAPI, Skill } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import {
  buildSkillCatalogResult,
  buildSkillListResult,
  compactSkillsInSystemPrompt,
  listAllSkills,
  loadCatalogSkills,
  searchSkillCatalog,
  SKILL_CATALOG_TOOL_NAME,
  type SkillCatalogQuery,
} from "../lib/skill-catalog";

/** Compact skill prompt exposure plus searchable skill loading. */
export default function skillCatalogExtension(pi: ExtensionAPI) {
  let currentSkills: Skill[] = [];

  pi.registerTool({
    name: "waldemar_list_skills",
    label: "Waldemar List Skills",
    description: "Return a complete overview of installed skills without loading full SKILL.md content.",
    promptSnippet: "List every installed skill when a full skill overview is needed.",
    parameters: Type.Object({}),
    async execute() {
      const skills = listAllSkills(currentSkills);
      return {
        content: [{ type: "text" as const, text: buildSkillListResult(skills) }],
        details: { skills },
      };
    },
  });

  pi.registerTool({
    name: SKILL_CATALOG_TOOL_NAME,
    label: "Waldemar Skill Catalog",
    description: "Search installed skills and load matching SKILL.md instructions on demand.",
    promptSnippet: "Search installed skills and load selected skill instructions on demand.",
    promptGuidelines: [
      "Use waldemar_list_skills when you need a complete overview of every installed skill rather than a specific search.",
      "Use waldemar_skill_catalog when the user asks for a workflow that may have a specialized installed skill.",
      "Do not guess skill instructions from memory; load the matching skill through waldemar_skill_catalog before following it.",
    ],
    parameters: Type.Object({
      query: Type.Optional(Type.String({ description: "Skill name, source, or purpose to search for." })),
      load: Type.Optional(Type.Array(Type.String(), { description: "Exact skill names whose SKILL.md instructions should be loaded." })),
      limit: Type.Optional(Type.Number({ description: "Maximum matching skills to return." })),
      listAll: Type.Optional(Type.Boolean({ description: "Return every matching skill instead of applying the limit." })),
    }),
    async execute(_toolCallId, params: SkillCatalogQuery) {
      const limit = params.limit ?? 12;
      const loaded = loadCatalogSkills(currentSkills, params.load);
      const matches = searchSkillCatalog(currentSkills, params.query, limit, params.listAll ?? false);

      return {
        content: [{ type: "text" as const, text: buildSkillCatalogResult(matches, loaded) }],
        details: { matches, loaded: loaded.map(({ content: _content, ...skill }) => skill) },
      };
    },
  });

  pi.on("before_agent_start", async (event) => {
    currentSkills = event.systemPromptOptions.skills ?? [];
    return {
      systemPrompt: compactSkillsInSystemPrompt(event.systemPrompt, currentSkills),
    };
  });
}
