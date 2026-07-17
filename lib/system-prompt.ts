export type PromptSection = {
  title: string;
  body: string | string[];
};

export function renderPromptSection(section: PromptSection): string {
  const body = Array.isArray(section.body) ? renderBullets(section.body) : section.body.trim();
  return [`# ${section.title}`, "", body].join("\n");
}

export function renderPromptSections(sections: PromptSection[]): string {
  return sections.map(renderPromptSection).join("\n\n");
}

function renderBullets(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}
