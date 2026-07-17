import type { Skill } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";

export const SKILL_CATALOG_TOOL_NAME = "waldemar_skill_catalog";

type SkillCatalogQuery = {
  query?: string;
  load?: string[];
  limit?: number;
  listAll?: boolean;
};

type SkillCatalogEntry = {
  name: string;
  description: string;
  location: string;
  source: string;
};

type LoadedSkill = SkillCatalogEntry & {
  content: string;
  baseDir: string;
};

const SKILL_PROMPT_PATTERN = /\n*The following skills provide specialized instructions for specific tasks\.[\s\S]*?<\/available_skills>/m;

export function compactSkillsInSystemPrompt(systemPrompt: string, skills: Skill[]): string {
  if (!SKILL_PROMPT_PATTERN.test(systemPrompt)) return systemPrompt;

  const compactSection = buildCompactSkillPrompt(skills);
  return systemPrompt.replace(SKILL_PROMPT_PATTERN, `\n\n${compactSection}`);
}

export function searchSkillCatalog(skills: Skill[], query = "", limit = 12, listAll = false): SkillCatalogEntry[] {
  const normalizedQuery = normalize(query);
  const visibleSkills = listAllSkills(skills);

  const matches = normalizedQuery
    ? visibleSkills.filter((skill) => matchesQuery(skill, normalizedQuery))
    : visibleSkills;

  if (listAll) return matches;
  return matches.slice(0, Math.max(1, limit));
}

export function listAllSkills(skills: Skill[]): SkillCatalogEntry[] {
  return skills
    .filter((skill) => !skill.disableModelInvocation)
    .map(toCatalogEntry)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function buildSkillListResult(skills: SkillCatalogEntry[]): string {
  return [
    "Waldemar Complete Skill Registry",
    "",
    ...skills.map((skill) => `- ${skill.name} (${skill.source}): ${skill.description}\n  location: ${skill.location}`),
    "",
    "Load exact instructions with waldemar_skill_catalog load: [\"skill-name\"].",
  ].join("\n");
}

export function loadCatalogSkills(skills: Skill[], requestedNames: string[] | undefined): LoadedSkill[] {
  if (!requestedNames || requestedNames.length === 0) return [];

  const byName = new Map(skills.map((skill) => [skill.name, skill]));
  const loaded: LoadedSkill[] = [];

  for (const name of requestedNames) {
    const skill = byName.get(name);
    if (!skill || skill.disableModelInvocation) continue;

    loaded.push({
      ...toCatalogEntry(skill),
      baseDir: skill.baseDir,
      content: fs.readFileSync(skill.filePath, "utf-8"),
    });
  }

  return loaded;
}

export function buildSkillCatalogResult(matches: SkillCatalogEntry[], loaded: LoadedSkill[]): string {
  const loadedSection = loaded.length > 0
    ? [
      "Loaded skill instructions:",
      ...loaded.flatMap(formatLoadedSkill),
      "",
    ]
    : [];

  const matchSection = matches.length > 0
    ? matches.map((skill) => `- ${skill.name} (${skill.source}): ${skill.description}\n  location: ${skill.location}`)
    : ["No matching skills found."];

  return [
    "Waldemar Skill Catalog",
    "",
    ...loadedSection,
    "Matching skills:",
    ...matchSection,
    "",
    "To see the full installed skill list, call waldemar_skill_catalog with listAll: true.",
    "To use a skill, call waldemar_skill_catalog with load: [\"skill-name\"], then follow the loaded SKILL.md instructions.",
    "When a skill references a relative path, resolve it against that skill's base directory.",
  ].join("\n");
}

function buildCompactSkillPrompt(skills: Skill[]): string {
  const visibleCount = skills.filter((skill) => !skill.disableModelInvocation).length;
  return [
    "# Skill Discovery",
    "",
    `${visibleCount} skills are installed but intentionally not listed here in full.`,
    "Use waldemar_skill_catalog to search skills by name or purpose when a task may need specialized instructions.",
    "Load a matching skill through waldemar_skill_catalog before following its workflow.",
    "When a loaded skill references a relative path, resolve it against the skill directory.",
  ].join("\n");
}

function toCatalogEntry(skill: Skill): SkillCatalogEntry {
  return {
    name: skill.name,
    description: skill.description,
    location: skill.filePath,
    source: skill.sourceInfo?.source || skill.sourceInfo?.path || "unknown",
  };
}

function matchesQuery(skill: SkillCatalogEntry, normalizedQuery: string): boolean {
  return [skill.name, skill.description, skill.source, skill.location].some((value) => normalize(value).includes(normalizedQuery));
}

function formatLoadedSkill(skill: LoadedSkill): string[] {
  return [
    `## ${skill.name}`,
    `location: ${skill.location}`,
    `baseDir: ${skill.baseDir}`,
    "",
    skill.content.trim(),
    "",
  ];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export type { SkillCatalogQuery };
